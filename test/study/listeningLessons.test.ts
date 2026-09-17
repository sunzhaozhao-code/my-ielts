import { describe, expect, it } from 'vitest'
import { LISTENING_LESSONS, selectListeningLesson } from '../../src/data/listeningLessons'

describe('listening lessons', () => {
  it('contains usable questions and valid answers', () => {
    expect(LISTENING_LESSONS.length).toBeGreaterThanOrEqual(6)
    for (const lesson of LISTENING_LESSONS) {
      expect(lesson.transcript.length).toBeGreaterThan(200)
      expect(lesson.questions.length).toBeGreaterThanOrEqual(3)
      for (const question of lesson.questions)
        expect(question.options[question.answer]).toBeTruthy()
    }
  })

  it('adapts downward after repeated low listening scores', () => {
    const attempts = Array.from({ length: 3 }, (_, index) => ({
      id: `attempt-${index}`,
      type: 'listening' as const,
      stage: 'ielts-6.5' as const,
      resourceId: `listening:lesson:${index}`,
      completedAt: '2026-09-17T00:00:00.000Z',
      durationSeconds: 600,
      accuracy: 40,
    }))
    expect(selectListeningLesson('ielts-6.5', attempts, 1).difficulty).toBe(2)
  })
})
