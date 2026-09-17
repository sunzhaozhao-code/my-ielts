import { describe, expect, it } from 'vitest'
import { addDays, advanceStage, dayDistance, registerStudyDate } from '../../src/domain/study/dayLifecycle'
import type { LearningProgress } from '../../src/types/study'

function progress(): LearningProgress {
  return {
    currentStage: 'foundation',
    stageProgress: 0,
    courseDay: 1,
    completedStudyDays: 0,
    streakDays: 0,
    totalMinutes: 0,
    totalCompletedTasks: 0,
    studyDates: [],
  }
}

describe('day lifecycle', () => {
  it('uses calendar dates only for streaks', () => {
    const state = progress()
    registerStudyDate(state, '2026-09-10')
    registerStudyDate(state, '2026-09-11')
    registerStudyDate(state, '2026-09-15')
    expect(state.completedStudyDays).toBe(3)
    expect(state.streakDays).toBe(1)
    expect(state.courseDay).toBe(1)
  })

  it('calculates date distance in local dates', () => {
    expect(dayDistance('2026-09-10', '2026-09-13')).toBe(3)
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01')
  })

  it('advances stage progress with completed study days', () => {
    const state = progress()
    advanceStage(state)
    expect(state.stageProgress).toBeGreaterThan(0)
    expect(state.currentStage).toBe('foundation')
  })

  it('advances faster for a longer completed session', () => {
    const short = progress()
    const long = progress()
    advanceStage(short, 30)
    advanceStage(long, 90)
    expect(long.stageProgress).toBeCloseTo(short.stageProgress * 3)
  })

  it('stops at the configured target stage', () => {
    const state = progress()
    state.currentStage = 'ielts-6'
    state.stageProgress = 99
    advanceStage(state, 60, 'ielts-6')
    expect(state.currentStage).toBe('ielts-6')
    expect(state.stageProgress).toBe(100)
  })

  it('caps time progress until ability requirements are met', () => {
    const state = progress()
    state.stageProgress = 99
    advanceStage(state, 60, 'ielts-6.5', false)
    expect(state.currentStage).toBe('foundation')
    expect(state.stageProgress).toBe(99)
  })
})
