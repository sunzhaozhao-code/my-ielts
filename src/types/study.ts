export type LearningStage =
  | 'foundation'
  | 'ielts-5'
  | 'ielts-5.5'
  | 'ielts-6'
  | 'ielts-6.5'
  | 'ielts-7'

export type TargetBand = 6 | 6.5 | 7
export type DailyMinutes = 30 | 45 | 60 | 90
export type ExamType = 'academic' | 'general'

export type DailyTaskType =
  | 'vocabulary-new'
  | 'vocabulary-review'
  | 'grammar'
  | 'listening'
  | 'reading'
  | 'writing'

export type DailyTaskStatus = 'pending' | 'in-progress' | 'completed' | 'skipped'
export type DailyPlanStatus = 'active' | 'completed' | 'skipped'
export type VocabularyRating = 'known' | 'fuzzy' | 'unknown'
export type VocabularyStatus = 'learned' | 'learning' | 'mastered' | 'review'
export type ErrorType = 'grammar' | 'listening' | 'reading'

export interface UserProfile {
  targetBand: TargetBand
  dailyMinutes: DailyMinutes
  examType: ExamType
  createdAt: string
  updatedAt: string
}

export interface DailyTask {
  id: string
  date: string
  dayNumber: number
  sequence: number
  type: DailyTaskType
  title: string
  description: string
  resourceId: string
  route: string
  estimatedMinutes: number
  status: DailyTaskStatus
  score?: number
  accuracy?: number
  completedAt?: string
  reviewRequired: boolean
  targetCount?: number
}

export interface DailyPlan {
  id: string
  dayNumber: number
  assignedDate: string
  stage: LearningStage
  estimatedMinutes: number
  status: DailyPlanStatus
  tasks: DailyTask[]
  createdAt: string
  completedAt?: string
}

export interface LearningProgress {
  currentStage: LearningStage
  stageProgress: number
  courseDay: number
  completedStudyDays: number
  streakDays: number
  totalMinutes: number
  totalCompletedTasks: number
  studyDates: string[]
}

export interface VocabularyProgress {
  resourceId: string
  wordId: number
  chapter: string
  word: string
  status: VocabularyStatus
  lastRating: VocabularyRating
  seenCount: number
  correctStreak: number
  lastReviewedAt: string
  nextReviewDate: string
}

export interface ErrorRecord {
  id: string
  resourceId: string
  type: ErrorType
  questionId: string
  title: string
  route: string
  wrongCount: number
  correctStreak: number
  lastWrongAt: string
  nextReviewDate: string
}

export interface SkillAttempt {
  id: string
  type: 'grammar' | 'listening' | 'reading' | 'writing'
  stage?: LearningStage
  resourceId: string
  completedAt: string
  durationSeconds: number
  accuracy?: number
  score?: number
  replayCount?: number
}

export interface StageRequirement {
  id: string
  label: string
  current: number
  target: number
  unit: string
  met: boolean
}

export interface StageReadiness {
  ready: boolean
  requirements: StageRequirement[]
}

export interface WritingDraft {
  resourceId: string
  taskId?: string
  prompt: string
  content: string
  updatedAt: string
  completedAt?: string
}

export interface StudyData {
  schemaVersion: 3
  updatedAt: string
  profile: UserProfile | null
  progress: LearningProgress
  activePlan: DailyPlan | null
  planHistory: DailyPlan[]
  vocabularyProgress: Record<string, VocabularyProgress>
  errorRecords: ErrorRecord[]
  skillAttempts: SkillAttempt[]
  writingDrafts: Record<string, WritingDraft>
}

export interface TaskTemplateItem {
  type: DailyTaskType
  title: string
  description: string
  resourceId: string
  route: string
  minutes: number
  reviewRequired?: boolean
  targetCount?: number
}

export interface ImportResult {
  ok: boolean
  message: string
  data?: StudyData
}
