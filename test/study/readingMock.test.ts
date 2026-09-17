import { describe, expect, it } from 'vitest'
import { READING_MOCK, READING_MOCK_QUESTION_COUNT } from '../../src/data/readingMock'
import { readingExpectedAnswer } from '../../src/data/readingLessons'

describe('full-volume reading practice', () => {
  it('contains three passages and exactly forty valid questions', () => {
    expect(READING_MOCK.passages.length).toBe(3)
    expect(READING_MOCK_QUESTION_COUNT).toBe(40)
    expect(READING_MOCK.durationMinutes).toBe(60)
    for (const passage of READING_MOCK.passages) {
      for (const question of passage.questions)
        expect(readingExpectedAnswer(question)).toBeTruthy()
    }
  })
})
