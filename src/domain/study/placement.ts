import { STAGES, getStageIndex, getTargetStage } from '~/data/stages'
import type { DailyMinutes, PlacementResult, TargetBand } from '~/types/study'

export function getPlacement(score: number): PlacementResult {
  if (score <= 5) {
    return {
      score,
      stage: 'foundation',
      stageInitialProgress: 0,
      label: '基础恢复',
      description: '先恢复高频词汇和基础语法，再进入雅思题型训练。',
    }
  }

  if (score <= 8) {
    return {
      score,
      stage: 'foundation',
      stageInitialProgress: 50,
      label: '基础恢复后段',
      description: '基础能力已经具备，从基础恢复阶段的后半程开始。',
    }
  }

  if (score <= 11) {
    return {
      score,
      stage: 'ielts-5',
      stageInitialProgress: 0,
      label: 'IELTS 5.0',
      description: '可以开始接触雅思基础题型，同时继续巩固词汇和语法。',
    }
  }

  if (score <= 13) {
    return {
      score,
      stage: 'ielts-5.5',
      stageInitialProgress: 0,
      label: 'IELTS 5.5',
      description: '基础较稳，可以增加听读训练和写作输出。',
    }
  }

  return {
    score,
    stage: 'ielts-6',
    stageInitialProgress: 0,
    label: 'IELTS 6.0',
    description: '从综合技能训练开始，重点补足听力和写作。',
  }
}

export function estimateStudyDays(
  placement: PlacementResult,
  targetBand: TargetBand,
  dailyMinutes: DailyMinutes,
) {
  const startIndex = getStageIndex(placement.stage)
  const requestedTarget = getTargetStage(targetBand)
  const requestedTargetIndex = getStageIndex(requestedTarget)
  const availableTargetIndex = Math.min(requestedTargetIndex, getStageIndex('ielts-6.5'))

  let courseDaysAt60 = 0
  for (let index = startIndex; index <= availableTargetIndex; index++) {
    const stage = STAGES[index]
    if (!stage.available)
      continue

    if (index === startIndex)
      courseDaysAt60 += stage.courseDaysAt60 * (1 - placement.stageInitialProgress / 100)
    else
      courseDaysAt60 += stage.courseDaysAt60
  }

  const estimatedDays = Math.max(1, Math.ceil(courseDaysAt60 * 60 / dailyMinutes))
  return {
    estimatedDays,
    routeEndsAt: STAGES[availableTargetIndex].id,
    targetBeyondCurrentRoute: requestedTarget === 'ielts-7',
  }
}
