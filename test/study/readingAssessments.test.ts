import { describe, expect, it } from 'vitest'
import { getReadingAssessment } from '../../src/data/readingAssessments'

describe('reading assessments', () => {
  it('builds a multi-passage assessment for every available stage', () => {
    for (const stage of ['foundation', 'ielts-5', 'ielts-5.5', 'ielts-6', 'ielts-6.5'] as const) {
      const assessment = getReadingAssessment(stage)
      expect(assessment.lessons.length).toBe(3)
      expect(assessment.questionCount).toBeGreaterThanOrEqual(13)
      expect(assessment.durationMinutes).toBeGreaterThanOrEqual(25)
    }
  })
})
