import { describe, expect, it } from 'vitest'
import { clearTimedPracticeSession, loadTimedPracticeSession, saveTimedPracticeSession } from '../../src/services/timedPracticeSession'
import type { StorageLike } from '../../src/services/studyStorage'

function memoryStorage(): StorageLike {
  const values = new Map<string, string>()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
}

describe('timed practice persistence', () => {
  it('restores answers and the original start time, then clears after submission', () => {
    const storage = memoryStorage()
    saveTimedPracticeSession('mock-1', { startedAt: 123, answers: { q1: 2, q2: 'water' } }, storage)
    expect(loadTimedPracticeSession('mock-1', storage)).toEqual({ startedAt: 123, answers: { q1: 2, q2: 'water' } })
    clearTimedPracticeSession('mock-1', storage)
    expect(loadTimedPracticeSession('mock-1', storage)).toBeNull()
  })

  it('ignores malformed saved sessions', () => {
    const storage = memoryStorage()
    storage.setItem('my-ielts:timed-practice:bad', '{broken')
    expect(loadTimedPracticeSession('bad', storage)).toBeNull()
  })
})
