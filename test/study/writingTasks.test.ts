import { describe, expect, it } from 'vitest'
import { WRITING_TASKS, selectWritingTask } from '../../src/data/writingTasks'

describe('writing task bank', () => {
  it('provides broad coverage for both IELTS test types', () => {
    expect(WRITING_TASKS.length).toBeGreaterThanOrEqual(25)
    expect(WRITING_TASKS.filter(task => task.examType === 'academic' && task.taskType === 'Task 1').length).toBeGreaterThanOrEqual(6)
    expect(WRITING_TASKS.filter(task => task.examType === 'general' && task.taskType === 'Task 1').length).toBeGreaterThanOrEqual(6)
    expect(WRITING_TASKS.filter(task => task.taskType === 'Task 2').length).toBeGreaterThanOrEqual(9)
  })

  it('never assigns an Academic-only task to a General learner', () => {
    for (let day = 1; day <= 50; day++)
      expect(selectWritingTask('ielts-6', day, 'general').examType).not.toBe('academic')
  })
})
