import { computed, reactive } from 'vue'
import { getAvailableTargetStage } from '~/data/stages'
import { addDays, advanceStage, registerStudyDate, toLocalDateKey } from '~/domain/study/dayLifecycle'
import { createDailyPlan } from '~/domain/study/planGenerator'
import { evaluateStageReadiness } from '~/domain/study/stageReadiness'
import { clearStudyData, createDefaultStudyData, loadStudyData, saveStudyData } from '~/services/studyStorage'
import type { DailyMinutes, ErrorType, ExamType, SkillAttempt, StudyData, TargetBand, UserProfile, VocabularyRating, WritingDraft } from '~/types/study'

const state = reactive<StudyData>(loadStudyData())

function persist(touch = true) {
  if (touch)
    state.updatedAt = new Date().toISOString()
  saveStudyData(state)
}

function ensureActivePlan(dateKey = toLocalDateKey()) {
  if (!state.profile)
    return null

  if (state.activePlan?.status === 'active')
    return state.activePlan

  if (state.activePlan?.status === 'completed' && state.activePlan.assignedDate === dateKey)
    return state.activePlan

  if (state.activePlan)
    state.planHistory.push(JSON.parse(JSON.stringify(state.activePlan)))

  state.activePlan = createDailyPlan(
    state.progress.currentStage,
    state.profile.dailyMinutes,
    state.progress.courseDay,
    dateKey,
  )
  const dueErrorCount = state.errorRecords.filter(record => record.nextReviewDate <= dateKey).length
  if (dueErrorCount > 0) {
    const reviewTask = state.activePlan.tasks.find(task => task.reviewRequired)
    if (reviewTask) {
      reviewTask.title = `到期复习 · ${dueErrorCount} 项错题`
      reviewTask.description = '先处理今天到期的单词和错题，再继续新内容。'
      reviewTask.resourceId = 'review:due'
      reviewTask.route = `/review?task=${reviewTask.id}`
    }
  }
  persist()
  return state.activePlan
}

function completeOnboarding(profile: UserProfile, stageProgress: number) {
  const fresh = createDefaultStudyData()
  Object.assign(state, fresh)
  state.profile = profile
  state.progress.currentStage = profile.startingStage
  state.progress.stageProgress = stageProgress
  ensureActivePlan()
  persist()
}

function setTaskCompleted(taskId: string, completed: boolean) {
  const task = state.activePlan?.tasks.find(item => item.id === taskId)
  if (!task || state.activePlan?.status !== 'active')
    return

  task.status = completed ? 'completed' : 'pending'
  task.completedAt = completed ? new Date().toISOString() : undefined
  persist()
}

function completeTaskWithResult(taskId: string | undefined, result: { score?: number; accuracy?: number; reviewRequired?: boolean } = {}) {
  if (!taskId)
    return

  const task = state.activePlan?.tasks.find(item => item.id === taskId)
  if (!task || state.activePlan?.status !== 'active')
    return

  task.status = 'completed'
  task.completedAt = new Date().toISOString()
  task.score = result.score
  task.accuracy = result.accuracy
  task.reviewRequired = result.reviewRequired ?? task.reviewRequired
  persist()
}

function recordVocabularyRating(payload: {
  wordId: number
  chapter: string
  word: string
  rating: VocabularyRating
  dateKey?: string
  sameDayRepeat?: boolean
}) {
  const dateKey = payload.dateKey ?? toLocalDateKey()
  const resourceId = `vocabulary:${payload.wordId}`
  const previous = state.vocabularyProgress[resourceId]
  const correctStreak = payload.rating === 'known' ? (previous?.correctStreak ?? 0) + 1 : 0
  const interval = payload.sameDayRepeat ? 1 : payload.rating === 'known' ? 3 : payload.rating === 'fuzzy' ? 1 : 0

  state.vocabularyProgress[resourceId] = {
    resourceId,
    wordId: payload.wordId,
    chapter: payload.chapter,
    word: payload.word,
    status: payload.sameDayRepeat
      ? 'review'
      : correctStreak >= 3
        ? 'mastered'
        : payload.rating === 'known'
          ? correctStreak === 1 ? 'learned' : 'learning'
          : 'review',
    lastRating: payload.rating,
    seenCount: (previous?.seenCount ?? 0) + 1,
    correctStreak,
    lastReviewedAt: new Date().toISOString(),
    nextReviewDate: addDays(dateKey, interval),
  }
  persist()
}

function recordQuestionResult(payload: {
  resourceId: string
  type: ErrorType
  questionId: string
  title: string
  route: string
  correct: boolean
  dateKey?: string
}) {
  const dateKey = payload.dateKey ?? toLocalDateKey()
  const id = `${payload.type}:${payload.resourceId}:${payload.questionId}`
  const index = state.errorRecords.findIndex(record => record.id === id)
  const previous = index >= 0 ? state.errorRecords[index] : null

  if (payload.correct && !previous)
    return

  const wrongCount = payload.correct ? previous!.wrongCount : (previous?.wrongCount ?? 0) + 1
  const correctStreak = payload.correct ? previous!.correctStreak + 1 : 0
  const interval = payload.correct
    ? Math.min(30, 2 ** (correctStreak + 1))
    : wrongCount === 1 ? 1 : wrongCount === 2 ? 2 : Math.min(7, wrongCount)

  const record = {
    id,
    resourceId: payload.resourceId,
    type: payload.type,
    questionId: payload.questionId,
    title: payload.title,
    route: payload.route,
    wrongCount,
    correctStreak,
    lastWrongAt: payload.correct ? previous!.lastWrongAt : new Date().toISOString(),
    nextReviewDate: addDays(dateKey, interval),
  }

  if (index >= 0)
    state.errorRecords[index] = record
  else
    state.errorRecords.push(record)
  persist()
}

function addSkillAttempt(attempt: Omit<SkillAttempt, 'id' | 'completedAt'>) {
  state.skillAttempts.push({
    ...attempt,
    stage: state.progress.currentStage,
    id: `${attempt.type}-${Date.now()}`,
    completedAt: new Date().toISOString(),
  })
  persist()
}

function saveWritingDraft(draft: WritingDraft) {
  state.writingDrafts[draft.resourceId] = draft
  persist()
}

function finalizeActiveDay(dateKey = toLocalDateKey()) {
  const plan = state.activePlan
  if (!plan || plan.status !== 'active' || plan.tasks.some(task => task.status !== 'completed'))
    return false

  plan.status = 'completed'
  plan.completedAt = new Date().toISOString()
  state.progress.totalMinutes += plan.estimatedMinutes
  state.progress.totalCompletedTasks += plan.tasks.length
  registerStudyDate(state.progress, dateKey)
  const readiness = evaluateStageReadiness(state)
  advanceStage(state.progress, plan.estimatedMinutes, getAvailableTargetStage(state.profile!.targetBand), readiness.ready)
  state.progress.courseDay += 1
  persist()
  return true
}

function reconfigureAfterAssessment(profile: UserProfile, stageProgress: number) {
  if (!state.profile) {
    completeOnboarding(profile, stageProgress)
    return
  }

  if (state.activePlan) {
    const archivedPlan = JSON.parse(JSON.stringify(state.activePlan))
    if (archivedPlan.status === 'active') {
      archivedPlan.status = 'skipped'
      archivedPlan.completedAt = new Date().toISOString()
    }
    state.planHistory.push(archivedPlan)
  }

  state.profile = {
    ...profile,
    createdAt: state.profile.createdAt,
  }
  state.progress.currentStage = profile.startingStage
  state.progress.stageProgress = stageProgress
  state.activePlan = null
  ensureActivePlan()
  persist()
}

function skipActiveDay(dateKey = toLocalDateKey()) {
  const plan = state.activePlan
  if (!plan || plan.status !== 'active')
    return

  plan.status = 'skipped'
  plan.completedAt = new Date().toISOString()
  state.planHistory.push(JSON.parse(JSON.stringify(plan)))
  state.progress.courseDay += 1
  state.activePlan = null
  ensureActivePlan(dateKey)
  persist()
}

function continueActiveDay() {
  persist()
}

function updateSettings(targetBand: TargetBand, dailyMinutes: DailyMinutes, examType: ExamType) {
  if (!state.profile)
    return

  state.profile.targetBand = targetBand
  state.profile.dailyMinutes = dailyMinutes
  state.profile.examType = examType
  state.profile.updatedAt = new Date().toISOString()
  persist()
}

function replaceData(data: StudyData) {
  Object.assign(state, JSON.parse(JSON.stringify(data)))
  persist()
}

function replaceDataFromCloud(data: StudyData) {
  Object.assign(state, JSON.parse(JSON.stringify(data)))
  persist(false)
}

function resetAllData() {
  clearStudyData()
  Object.assign(state, createDefaultStudyData())
}

export function useStudyStore() {
  return {
    state,
    profile: computed(() => state.profile),
    progress: computed(() => state.progress),
    activePlan: computed(() => state.activePlan),
    ensureActivePlan,
    completeOnboarding,
    reconfigureAfterAssessment,
    setTaskCompleted,
    completeTaskWithResult,
    recordVocabularyRating,
    recordQuestionResult,
    addSkillAttempt,
    saveWritingDraft,
    finalizeActiveDay,
    skipActiveDay,
    continueActiveDay,
    updateSettings,
    replaceData,
    replaceDataFromCloud,
    resetAllData,
  }
}
