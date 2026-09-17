import type { ImportResult, StudyData, UserProfile } from '~/types/study'

export const STUDY_STORAGE_KEY = 'my-ielts:study-data'

export interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export function createDefaultStudyData(): StudyData {
  return {
    schemaVersion: 3,
    updatedAt: '1970-01-01T00:00:00.000Z',
    profile: null,
    progress: {
      currentStage: 'foundation',
      stageProgress: 0,
      courseDay: 1,
      completedStudyDays: 0,
      streakDays: 0,
      totalMinutes: 0,
      totalCompletedTasks: 0,
      studyDates: [],
    },
    activePlan: null,
    planHistory: [],
    vocabularyProgress: {},
    errorRecords: [],
    skillAttempts: [],
    writingDrafts: {},
  }
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined')
    return null
  return window.localStorage
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isDailyTask(value: unknown) {
  if (!isRecord(value))
    return false
  return typeof value.id === 'string'
    && typeof value.type === 'string'
    && typeof value.title === 'string'
    && typeof value.route === 'string'
    && typeof value.estimatedMinutes === 'number'
    && ['pending', 'in-progress', 'completed', 'skipped'].includes(String(value.status))
}

function isDailyPlan(value: unknown) {
  if (!isRecord(value))
    return false
  return typeof value.id === 'string'
    && typeof value.dayNumber === 'number'
    && typeof value.assignedDate === 'string'
    && Array.isArray(value.tasks)
    && value.tasks.every(isDailyTask)
    && ['active', 'completed', 'skipped'].includes(String(value.status))
}

function isProfile(value: unknown) {
  if (value === null)
    return true
  if (!isRecord(value))
    return false
  return [6, 6.5, 7].includes(Number(value.targetBand))
    && [30, 45, 60, 90].includes(Number(value.dailyMinutes))
    && (value.examType === undefined || ['academic', 'general'].includes(String(value.examType)))
}

function isProgress(value: unknown) {
  if (!isRecord(value))
    return false
  return typeof value.currentStage === 'string'
    && typeof value.stageProgress === 'number'
    && typeof value.courseDay === 'number'
    && Array.isArray(value.studyDates)
    && value.studyDates.every(date => typeof date === 'string')
}

function isVocabularyProgress(value: unknown) {
  return isRecord(value) && Object.values(value).every(item => isRecord(item)
    && typeof item.resourceId === 'string'
    && typeof item.wordId === 'number'
    && typeof item.nextReviewDate === 'string')
}

function isErrorRecords(value: unknown) {
  return Array.isArray(value) && value.every(item => isRecord(item)
    && typeof item.id === 'string'
    && typeof item.type === 'string'
    && typeof item.route === 'string'
    && typeof item.nextReviewDate === 'string')
}

function isStudyData(value: unknown): value is StudyData {
  if (!isRecord(value))
    return false

  return [1, 2, 3].includes(Number(value.schemaVersion))
    && (value.updatedAt === undefined || typeof value.updatedAt === 'string')
    && isProfile(value.profile)
    && isProgress(value.progress)
    && (value.activePlan === null || isDailyPlan(value.activePlan))
    && Array.isArray(value.planHistory)
    && value.planHistory.every(isDailyPlan)
    && isVocabularyProgress(value.vocabularyProgress)
    && isErrorRecords(value.errorRecords)
    && Array.isArray(value.skillAttempts)
    && isRecord(value.writingDrafts)
}

function normalizeStudyData(data: StudyData): StudyData {
  const legacyProfile = data.profile as (UserProfile & { assessmentScore?: number; startingStage?: string }) | null
  const restartCompleteRoute = data.schemaVersion < 3 && legacyProfile?.startingStage !== undefined && legacyProfile.startingStage !== 'foundation'
  const archivedActivePlan = restartCompleteRoute && data.activePlan
    ? { ...data.activePlan, status: 'skipped' as const, completedAt: new Date().toISOString() }
    : null

  return {
    ...createDefaultStudyData(),
    ...data,
    schemaVersion: 3,
    profile: legacyProfile
      ? {
          targetBand: legacyProfile.targetBand,
          dailyMinutes: legacyProfile.dailyMinutes,
          examType: legacyProfile.examType ?? 'academic',
          createdAt: legacyProfile.createdAt,
          updatedAt: legacyProfile.updatedAt,
        }
      : null,
    progress: {
      ...createDefaultStudyData().progress,
      ...data.progress,
      currentStage: restartCompleteRoute ? 'foundation' : data.progress.currentStage,
      stageProgress: restartCompleteRoute ? 0 : data.progress.stageProgress,
      courseDay: restartCompleteRoute ? 1 : data.progress.courseDay,
    },
    activePlan: restartCompleteRoute ? null : data.activePlan,
    planHistory: archivedActivePlan ? [...data.planHistory, archivedActivePlan] : data.planHistory,
    vocabularyProgress: data.vocabularyProgress ?? {},
    errorRecords: data.errorRecords ?? [],
    skillAttempts: data.skillAttempts ?? [],
    writingDrafts: data.writingDrafts ?? {},
    updatedAt: data.updatedAt ?? data.profile?.updatedAt ?? '1970-01-01T00:00:00.000Z',
  }
}

export function loadStudyData(storage: StorageLike | null = getBrowserStorage()): StudyData {
  if (!storage)
    return createDefaultStudyData()

  try {
    const raw = storage.getItem(STUDY_STORAGE_KEY)
    if (!raw)
      return createDefaultStudyData()

    const parsed: unknown = JSON.parse(raw)
    return isStudyData(parsed) ? normalizeStudyData(parsed) : createDefaultStudyData()
  }
  catch {
    return createDefaultStudyData()
  }
}

export function saveStudyData(data: StudyData, storage: StorageLike | null = getBrowserStorage()) {
  storage?.setItem(STUDY_STORAGE_KEY, JSON.stringify(data))
}

export function clearStudyData(storage: StorageLike | null = getBrowserStorage()) {
  storage?.removeItem(STUDY_STORAGE_KEY)
}

export function hasCompletedOnboarding(storage: StorageLike | null = getBrowserStorage()) {
  return Boolean(loadStudyData(storage).profile)
}

export function exportStudyData(data: StudyData) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    app: 'my-ielts',
    data,
  }, null, 2)
}

export function importStudyData(raw: string): ImportResult {
  try {
    const parsed: unknown = JSON.parse(raw)
    const candidate = parsed && typeof parsed === 'object' && 'data' in parsed
      ? (parsed as { data: unknown }).data
      : parsed

    if (!isStudyData(candidate))
      return { ok: false, message: '文件不是有效的 My IELTS 学习数据。' }

    return { ok: true, message: '学习数据读取成功。', data: normalizeStudyData(candidate) }
  }
  catch {
    return { ok: false, message: 'JSON 文件无法解析。' }
  }
}
