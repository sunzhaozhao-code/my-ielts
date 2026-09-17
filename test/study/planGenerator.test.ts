import { describe, expect, it } from 'vitest'
import { createDailyPlan, getTaskTemplate } from '../../src/domain/study/planGenerator'

describe('daily task generator', () => {
  it.each([30, 45, 60, 90] as const)('fits the %s minute budget', (minutes) => {
    const tasks = getTaskTemplate('foundation', minutes, 1)
    expect(tasks.reduce((sum, task) => sum + task.minutes, 0)).toBe(minutes)
  })

  it('uses the exact foundation template at 60 minutes', () => {
    const plan = createDailyPlan('foundation', 60, 12, '2026-09-17')
    expect(plan.tasks).toHaveLength(5)
    expect(plan.tasks.map(task => task.type)).toEqual([
      'vocabulary-review',
      'vocabulary-new',
      'grammar',
      'listening',
      'reading',
    ])
    expect(plan.estimatedMinutes).toBe(60)
  })

  it('creates stable task ids within a course day', () => {
    const plan = createDailyPlan('ielts-5.5', 60, 3, '2026-09-17')
    expect(plan.id).toBe('day-3')
    expect(plan.tasks[0].id).toBe('day-3-1')
    expect(plan.tasks.every(task => task.dayNumber === 3)).toBe(true)
    expect(plan.tasks.every(task => task.route.includes('task=day-3-'))).toBe(true)
  })

  it('continues assigning unseen vocabulary in advanced stages', () => {
    const tasks = getTaskTemplate('ielts-6.5', 60, 140)
    expect(tasks.map(task => task.type)).toContain('vocabulary-new')
    expect(tasks.reduce((sum, task) => sum + task.minutes, 0)).toBe(60)
  })
})
