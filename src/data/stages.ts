import type { LearningStage, TargetBand } from '~/types/study'

export interface StageDefinition {
  id: LearningStage
  label: string
  shortLabel: string
  description: string
  courseDaysAt60: number
  available: boolean
}

export const STAGES: StageDefinition[] = [
  {
    id: 'foundation',
    label: '基础恢复',
    shortLabel: '基础恢复',
    description: '恢复高频词汇、基础时态和日常听读能力。',
    courseDaysAt60: 28,
    available: true,
  },
  {
    id: 'ielts-5',
    label: 'IELTS 5.0',
    shortLabel: '5.0',
    description: '开始建立雅思题型意识和基础答题能力。',
    courseDaysAt60: 28,
    available: true,
  },
  {
    id: 'ielts-5.5',
    label: 'IELTS 5.5',
    shortLabel: '5.5',
    description: '增加限时训练，并逐步提高写作占比。',
    courseDaysAt60: 35,
    available: true,
  },
  {
    id: 'ielts-6',
    label: 'IELTS 6.0',
    shortLabel: '6.0',
    description: '以听力、阅读和写作为核心，持续复盘错题。',
    courseDaysAt60: 42,
    available: true,
  },
  {
    id: 'ielts-6.5',
    label: 'IELTS 6.5',
    shortLabel: '6.5',
    description: '增加雅思题型训练，减少孤立的基础知识学习。',
    courseDaysAt60: 48,
    available: true,
  },
  {
    id: 'ielts-7',
    label: 'IELTS 7.0',
    shortLabel: '7.0',
    description: '数据结构已预留，完整课程将在后续版本补充。',
    courseDaysAt60: 0,
    available: false,
  },
]

export const AVAILABLE_STAGE_IDS = STAGES.filter(stage => stage.available).map(stage => stage.id)

export function getStage(stageId: LearningStage) {
  return STAGES.find(stage => stage.id === stageId) ?? STAGES[0]
}

export function getStageIndex(stageId: LearningStage) {
  return STAGES.findIndex(stage => stage.id === stageId)
}

export function getTargetStage(targetBand: TargetBand): LearningStage {
  if (targetBand === 6)
    return 'ielts-6'
  if (targetBand === 6.5)
    return 'ielts-6.5'
  return 'ielts-7'
}

export function getAvailableTargetStage(targetBand: TargetBand): LearningStage {
  const target = getTargetStage(targetBand)
  return getStage(target).available ? target : 'ielts-6.5'
}

export function getNextAvailableStage(stageId: LearningStage): LearningStage | null {
  const index = getStageIndex(stageId)
  const next = STAGES.slice(index + 1).find(stage => stage.available)
  return next?.id ?? null
}
