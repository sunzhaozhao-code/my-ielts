import { describe, expect, it } from 'vitest'
import { evaluateStageReadiness } from '../../src/domain/study/stageReadiness'
import { createDefaultStudyData } from '../../src/services/studyStorage'

describe('stage readiness', () => {
  it('keeps a new learner in the current stage until ability requirements are met', () => {
    const data = createDefaultStudyData()
    const result = evaluateStageReadiness(data, 'foundation')

    expect(result.ready).toBe(false)
    expect(result.requirements.some(item => item.id === 'reading-attempts' && !item.met)).toBe(true)
  })

  it('allows foundation graduation after enough accurate practice and vocabulary', () => {
    const data = createDefaultStudyData()
    data.skillAttempts = [
      ...Array.from({ length: 3 }, (_, index) => ({ id: `r-${index}`, type: 'reading' as const, resourceId: `r-${index}`, accuracy: 80, durationSeconds: 600, completedAt: '2026-09-17T00:00:00.000Z', stage: 'foundation' as const })),
      ...Array.from({ length: 3 }, (_, index) => ({ id: `l-${index}`, type: 'listening' as const, resourceId: `l-${index}`, accuracy: 80, durationSeconds: 600, completedAt: '2026-09-17T00:00:00.000Z', stage: 'foundation' as const })),
      ...Array.from({ length: 3 }, (_, index) => ({ id: `g-${index}`, type: 'grammar' as const, resourceId: `g-${index}`, accuracy: 80, durationSeconds: 600, completedAt: '2026-09-17T00:00:00.000Z', stage: 'foundation' as const })),
    ]
    data.vocabularyProgress = Object.fromEntries(Array.from({ length: 50 }, (_, index) => [
      `vocabulary:${index}`,
      { resourceId: `vocabulary:${index}`, wordId: index, chapter: 'Chapter 1', word: `word-${index}`, status: 'learning' as const, lastRating: 'fuzzy' as const, seenCount: 1, nextReviewDate: '2026-09-18', correctStreak: 0, lastReviewedAt: '2026-09-17T00:00:00.000Z' },
    ]))

    expect(evaluateStageReadiness(data, 'foundation').ready).toBe(true)
  })

  it('does not let practice from another stage satisfy the current stage', () => {
    const data = createDefaultStudyData()
    data.skillAttempts = Array.from({ length: 9 }, (_, index) => ({
      id: `other-${index}`,
      type: (['reading', 'listening', 'grammar'] as const)[index % 3],
      resourceId: `other-${index}`,
      accuracy: 100,
      durationSeconds: 600,
      completedAt: '2026-09-17T00:00:00.000Z',
      stage: 'ielts-5' as const,
    }))

    expect(evaluateStageReadiness(data, 'foundation').ready).toBe(false)
  })
})
