import { describe, expect, it } from 'vitest'
import { estimateStudyDays, getPlacement } from '../../src/domain/study/placement'

describe('placement rules', () => {
  it.each([
    [0, 'foundation', 0],
    [5, 'foundation', 0],
    [6, 'foundation', 50],
    [8, 'foundation', 50],
    [9, 'ielts-5', 0],
    [11, 'ielts-5', 0],
    [12, 'ielts-5.5', 0],
    [13, 'ielts-5.5', 0],
    [14, 'ielts-6', 0],
    [15, 'ielts-6', 0],
  ])('maps score %s to %s', (score, stage, progress) => {
    const result = getPlacement(score as number)
    expect(result.stage).toBe(stage)
    expect(result.stageInitialProgress).toBe(progress)
  })

  it('marks a 7.0 target as beyond the current course route', () => {
    const estimate = estimateStudyDays(getPlacement(10), 7, 60)
    expect(estimate.routeEndsAt).toBe('ielts-6.5')
    expect(estimate.targetBeyondCurrentRoute).toBe(true)
  })
})
