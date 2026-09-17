import type { LearningStage, StageReadiness, StudyData } from '~/types/study'

interface StageThresholds {
  readingAttempts: number
  readingAccuracy: number
  listeningAttempts: number
  listeningAccuracy: number
  grammarAttempts: number
  grammarAccuracy: number
  writingAttempts: number
  vocabularySeen: number
}

const THRESHOLDS: Record<LearningStage, StageThresholds> = {
  foundation: { readingAttempts: 3, readingAccuracy: 60, listeningAttempts: 3, listeningAccuracy: 60, grammarAttempts: 3, grammarAccuracy: 60, writingAttempts: 0, vocabularySeen: 50 },
  'ielts-5': { readingAttempts: 5, readingAccuracy: 65, listeningAttempts: 5, listeningAccuracy: 65, grammarAttempts: 3, grammarAccuracy: 65, writingAttempts: 2, vocabularySeen: 150 },
  'ielts-5.5': { readingAttempts: 5, readingAccuracy: 70, listeningAttempts: 5, listeningAccuracy: 70, grammarAttempts: 0, grammarAccuracy: 0, writingAttempts: 3, vocabularySeen: 300 },
  'ielts-6': { readingAttempts: 5, readingAccuracy: 75, listeningAttempts: 5, listeningAccuracy: 75, grammarAttempts: 0, grammarAccuracy: 0, writingAttempts: 4, vocabularySeen: 500 },
  'ielts-6.5': { readingAttempts: 5, readingAccuracy: 80, listeningAttempts: 5, listeningAccuracy: 80, grammarAttempts: 0, grammarAccuracy: 0, writingAttempts: 6, vocabularySeen: 800 },
  'ielts-7': { readingAttempts: 8, readingAccuracy: 85, listeningAttempts: 8, listeningAccuracy: 85, grammarAttempts: 0, grammarAccuracy: 0, writingAttempts: 8, vocabularySeen: 1000 },
}

function stageAttempts(data: StudyData, stage: LearningStage, type: 'grammar' | 'listening' | 'reading' | 'writing') {
  return data.skillAttempts.filter(attempt => attempt.type === type && (!attempt.stage || attempt.stage === stage))
}

function recentAccuracy(data: StudyData, stage: LearningStage, type: 'grammar' | 'listening' | 'reading') {
  const attempts = stageAttempts(data, stage, type).filter(attempt => attempt.accuracy !== undefined).slice(-5)
  if (!attempts.length)
    return 0
  return Math.round(attempts.reduce((sum, attempt) => sum + (attempt.accuracy ?? 0), 0) / attempts.length)
}

export function evaluateStageReadiness(data: StudyData, stage: LearningStage = data.progress.currentStage): StageReadiness {
  const threshold = THRESHOLDS[stage]
  const reading = stageAttempts(data, stage, 'reading').filter(attempt => attempt.accuracy !== undefined)
  const listening = stageAttempts(data, stage, 'listening').filter(attempt => attempt.accuracy !== undefined)
  const grammar = stageAttempts(data, stage, 'grammar').filter(attempt => attempt.accuracy !== undefined)
  const writing = stageAttempts(data, stage, 'writing')
  const vocabularySeen = Object.keys(data.vocabularyProgress).length

  const requirements = [
    { id: 'reading-attempts', label: '阅读有效训练', current: reading.length, target: threshold.readingAttempts, unit: '次', met: reading.length >= threshold.readingAttempts },
    { id: 'reading-accuracy', label: '最近阅读正确率', current: recentAccuracy(data, stage, 'reading'), target: threshold.readingAccuracy, unit: '%', met: recentAccuracy(data, stage, 'reading') >= threshold.readingAccuracy },
    { id: 'listening-attempts', label: '听力有效训练', current: listening.length, target: threshold.listeningAttempts, unit: '次', met: listening.length >= threshold.listeningAttempts },
    { id: 'listening-accuracy', label: '最近听力正确率', current: recentAccuracy(data, stage, 'listening'), target: threshold.listeningAccuracy, unit: '%', met: recentAccuracy(data, stage, 'listening') >= threshold.listeningAccuracy },
    { id: 'grammar-attempts', label: '语法有效训练', current: grammar.length, target: threshold.grammarAttempts, unit: '次', met: grammar.length >= threshold.grammarAttempts },
    { id: 'grammar-accuracy', label: '最近语法正确率', current: recentAccuracy(data, stage, 'grammar'), target: threshold.grammarAccuracy, unit: '%', met: recentAccuracy(data, stage, 'grammar') >= threshold.grammarAccuracy },
    { id: 'writing-attempts', label: '完成写作训练', current: writing.length, target: threshold.writingAttempts, unit: '篇', met: writing.length >= threshold.writingAttempts },
    { id: 'vocabulary-seen', label: '已学习词汇', current: vocabularySeen, target: threshold.vocabularySeen, unit: '个', met: vocabularySeen >= threshold.vocabularySeen },
  ].filter(requirement => requirement.target > 0)

  return {
    ready: requirements.every(requirement => requirement.met),
    requirements,
  }
}
