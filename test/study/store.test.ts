import { afterEach, describe, expect, it } from 'vitest'
import { useStudyStore } from '../../src/composables/useStudyStore'
import type { UserProfile } from '../../src/types/study'

function profile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    targetBand: 6.5,
    dailyMinutes: 60,
    examType: 'academic',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('study store plan reconfiguration', () => {
  const store = useStudyStore()

  afterEach(() => store.resetAllData())

  it('keeps learning records when the user takes the assessment again', () => {
    store.completeOnboarding(profile())
    store.state.vocabularyProgress['vocabulary:1'] = {
      resourceId: 'vocabulary:1',
      wordId: 1,
      chapter: 'test',
      word: 'example',
      status: 'learning',
      lastRating: 'known',
      seenCount: 1,
      correctStreak: 1,
      lastReviewedAt: '2026-09-01T00:00:00.000Z',
      nextReviewDate: '2026-09-04',
    }

    store.reconfigureLearningPlan(profile({ targetBand: 6 }))

    expect(store.state.vocabularyProgress['vocabulary:1']?.word).toBe('example')
    expect(store.progress.value.currentStage).toBe('foundation')
    expect(store.activePlan.value?.stage).toBe('foundation')
    expect(store.profile.value?.createdAt).toBe('2026-09-01T00:00:00.000Z')
  })
})
