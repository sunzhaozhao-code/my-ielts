import type { StorageLike } from '~/services/studyStorage'

export type TimedAnswer = number | string | null

export interface TimedPracticeSession {
  startedAt: number
  answers: Record<string, TimedAnswer>
}

const PREFIX = 'my-ielts:timed-practice:'

function browserStorage(): StorageLike | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function loadTimedPracticeSession(id: string, storage: StorageLike | null = browserStorage()): TimedPracticeSession | null {
  if (!storage)
    return null
  try {
    const raw = storage.getItem(`${PREFIX}${id}`)
    if (!raw)
      return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object')
      return null
    const candidate = value as Partial<TimedPracticeSession>
    if (typeof candidate.startedAt !== 'number' || !candidate.answers || typeof candidate.answers !== 'object' || Array.isArray(candidate.answers))
      return null
    return { startedAt: candidate.startedAt, answers: candidate.answers as Record<string, TimedAnswer> }
  }
  catch {
    return null
  }
}

export function saveTimedPracticeSession(id: string, session: TimedPracticeSession, storage: StorageLike | null = browserStorage()) {
  storage?.setItem(`${PREFIX}${id}`, JSON.stringify(session))
}

export function clearTimedPracticeSession(id: string, storage: StorageLike | null = browserStorage()) {
  storage?.removeItem(`${PREFIX}${id}`)
}
