import { describe, expect, it } from 'vitest'
import { estimateStudyDays } from '../../src/domain/study/placement'

describe('complete course estimate', () => {
  it('always includes the complete route from foundation', () => {
    expect(estimateStudyDays(6, 60).estimatedDays).toBe(181)
    expect(estimateStudyDays(6.5, 60).estimatedDays).toBe(181)
  })

  it('marks a 7.0 target as beyond the current course route', () => {
    const estimate = estimateStudyDays(7, 60)
    expect(estimate.routeEndsAt).toBe('ielts-6.5')
    expect(estimate.targetBeyondCurrentRoute).toBe(true)
  })
})
