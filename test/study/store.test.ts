import { afterEach, describe, expect, it } from 'vitest'
import { useStudyStore } from '../../src/composables/useStudyStore'
import type { UserProfile } from '../../src/types/study'

function profile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    assessmentScore: 7,
    startingStage: 'foundation',
    targetBand: 6.5,
    dailyMinutes: 60,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('study store re-assessment', () => {
  const store = useStudyStore()

  afterEach(() => store.resetAllData())

  it('keeps learning records when the user takes the assessment again', () => {
    store.completeOnboarding(profile(), 50)
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

    store.reconfigureAfterAssessment(profile({ assessmentScore: 12, startingStage: 'ielts-5.5' }), 0)

    expect(store.state.vocabularyProgress['vocabulary:1']?.word).toBe('example')
    expect(store.progress.value.currentStage).toBe('ielts-5.5')
    expect(store.activePlan.value?.stage).toBe('ielts-5.5')
    expect(store.profile.value?.createdAt).toBe('2026-09-01T00:00:00.000Z')
  })
})
