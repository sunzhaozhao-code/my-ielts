import { describe, expect, it } from 'vitest'
import { getReadingLesson } from '../../src/data/readingLessons'

describe('reading review lookup', () => {
  it('returns the exact lesson recorded by a wrong answer', () => {
    expect(getReadingLesson('sleep-memory')?.title).toBe('Sleep and Memory')
    expect(getReadingLesson('missing')).toBeUndefined()
  })
})
