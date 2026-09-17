import { describe, expect, it } from 'vitest'
import { READING_LESSONS, getReadingLesson, isReadingAnswerCorrect, readingExpectedAnswer } from '../../src/data/readingLessons'

describe('reading review lookup', () => {
  it('returns the exact lesson recorded by a wrong answer', () => {
    expect(getReadingLesson('sleep-memory')?.title).toBe('Sleep and Memory')
    expect(getReadingLesson('missing')).toBeUndefined()
  })

  it('contains a broader lesson bank with valid questions', () => {
    expect(READING_LESSONS.length).toBeGreaterThanOrEqual(12)
    for (const lesson of READING_LESSONS) {
      for (const question of lesson.questions)
        expect(readingExpectedAnswer(question)).toBeTruthy()
    }
  })

  it('grades short answers without punctuation or case sensitivity', () => {
    const question = getReadingLesson('repair-cafes')!.questions.find(item => item.id === 'rc-2')!
    expect(isReadingAnswerCorrect(question, 'New Cable.')).toBe(true)
    expect(isReadingAnswerCorrect(question, 'a lamp')).toBe(false)
  })
})
