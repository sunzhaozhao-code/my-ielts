import { STAGES, getStageIndex, getTargetStage } from '~/data/stages'
import type { DailyMinutes, TargetBand } from '~/types/study'

export function estimateStudyDays(
  targetBand: TargetBand,
  dailyMinutes: DailyMinutes,
) {
  const startIndex = getStageIndex('foundation')
  const requestedTarget = getTargetStage(targetBand)
  const availableTargetIndex = getStageIndex('ielts-6.5')

  let courseDaysAt60 = 0
  for (let index = startIndex; index <= availableTargetIndex; index++) {
    const stage = STAGES[index]
    if (!stage.available)
      continue

    courseDaysAt60 += stage.courseDaysAt60
  }

  const estimatedDays = Math.max(1, Math.ceil(courseDaysAt60 * 60 / dailyMinutes))
  return {
    estimatedDays,
    routeEndsAt: STAGES[availableTargetIndex].id,
    targetBeyondCurrentRoute: requestedTarget === 'ielts-7',
  }
}
