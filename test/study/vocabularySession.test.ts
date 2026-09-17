import { describe, expect, it } from 'vitest'
import { createVocabularySession } from '../../src/domain/resources/vocabulary'
import type { VocabularyProgress } from '../../src/types/study'

describe('vocabulary sessions', () => {
  it('does not mix unseen words into a review session', () => {
    const progress: Record<string, VocabularyProgress> = {}
    expect(createVocabularySession(progress, 'review', 10, '2026-09-17', 1)).toEqual([])
  })

  it('only returns review words that are due', () => {
    const firstWord = createVocabularySession({}, 'new', 1, '2026-09-17', 1)[0]
    const progress: Record<string, VocabularyProgress> = {
      [`vocabulary:${firstWord.id}`]: {
        resourceId: `vocabulary:${firstWord.id}`,
        wordId: firstWord.id,
        chapter: firstWord.chapter,
        word: firstWord.words[0],
        status: 'learning',
        lastRating: 'fuzzy',
        seenCount: 1,
        nextReviewDate: '2026-09-18',
        correctStreak: 0,
        lastReviewedAt: '2026-09-17T00:00:00.000Z',
      },
    }

    expect(createVocabularySession(progress, 'review', 10, '2026-09-17', 1)).toEqual([])
    expect(createVocabularySession(progress, 'review', 10, '2026-09-18', 1).map(word => word.id)).toContain(firstWord.id)
  })

  it('starts new-word sessions with the first unseen words regardless of course day', () => {
    const dayOne = createVocabularySession({}, 'new', 3, '2026-09-17', 1)
    const dayHundred = createVocabularySession({}, 'new', 3, '2026-09-17', 100)
    expect(dayHundred.map(word => word.id)).toEqual(dayOne.map(word => word.id))
  })
})
