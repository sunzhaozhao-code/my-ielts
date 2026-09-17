import { READING_LESSONS } from '~/data/readingLessons'
import type { LearningStage } from '~/types/study'

const ASSESSMENT_IDS: Record<LearningStage, string[]> = {
  foundation: ['repair-cafes', 'city-bikes', 'rooftop-farms'],
  'ielts-5': ['repair-cafes', 'rooftop-farms', 'plastic-sorting'],
  'ielts-5.5': ['rooftop-farms', 'plastic-sorting', 'pollinator-corridors'],
  'ielts-6': ['plastic-sorting', 'pollinator-corridors', 'ancient-navigation'],
  'ielts-6.5': ['pollinator-corridors', 'ancient-navigation', 'office-sound'],
  'ielts-7': ['pollinator-corridors', 'ancient-navigation', 'office-sound'],
}

export function getReadingAssessment(stage: LearningStage) {
  const lessons = ASSESSMENT_IDS[stage]
    .map(id => READING_LESSONS.find(lesson => lesson.id === id))
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
  return {
    id: `${stage}-reading-check`,
    stage,
    title: `${stage === 'foundation' ? '基础恢复' : stage.replace('ielts-', 'IELTS ')}阶段阅读测评`,
    durationMinutes: stage === 'foundation' ? 25 : 35,
    lessons,
    questionCount: lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0),
  }
}
