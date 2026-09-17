import type { LearningStage, TaskTemplateItem } from '~/types/study'

const grammarTopics = [
  'be 动词与基本句型',
  '一般现在时',
  '一般过去时',
  '现在完成时',
  '一般将来时',
  'want to do / enjoy doing',
  '情态动词',
  '比较级与最高级',
  '被动语态',
  '条件句',
  '介词',
  '定语从句',
  '宾语从句',
  '状语从句',
]

function rotatingGrammar(dayNumber: number) {
  return grammarTopics[(dayNumber - 1) % grammarTopics.length]
}

function vocabularyReview(minutes: number, count = 10): TaskTemplateItem {
  return {
    type: 'vocabulary-review',
    title: '复习词汇 10 个',
    description: '优先复习最近接触过的词汇。',
    resourceId: 'vocabulary:due-review',
    route: '/learn/vocabulary?mode=review',
    minutes,
    reviewRequired: true,
    targetCount: count,
  }
}

function vocabularyNew(minutes: number, count: number): TaskTemplateItem {
  return {
    type: 'vocabulary-new',
    title: `新词 ${count} 个`,
    description: '从现有词库继续学习，不需要自己挑章节。',
    resourceId: 'vocabulary:daily-new',
    route: '/learn/vocabulary?mode=new',
    minutes,
    targetCount: count,
  }
}

function grammar(minutes: number, dayNumber: number): TaskTemplateItem {
  const topic = rotatingGrammar(dayNumber)
  return {
    type: 'grammar',
    title: `基础语法 · ${topic}`,
    description: '阅读中文说明和例句，完成今天的知识点。',
    resourceId: `grammar:${topic}`,
    route: `/learn/grammar?topic=${encodeURIComponent(topic)}`,
    minutes,
  }
}

function listening(minutes: number, advanced = false): TaskTemplateItem {
  return {
    type: 'listening',
    title: advanced ? '听力训练 · 雅思题型' : '听力训练 · 179 考点词',
    description: advanced ? '完成一组听力训练并记录结果。' : '听音频，输入考点词和同义替换。',
    resourceId: advanced ? 'listening:comprehension' : 'listening:179',
    route: advanced ? '/learn/listening-comprehension' : '/learn/listening',
    minutes,
    targetCount: advanced ? 15 : 10,
  }
}

function reading(minutes: number, advanced = false): TaskTemplateItem {
  return {
    type: 'reading',
    title: advanced ? '阅读训练 · 雅思题型' : '阅读训练 · 同义替换',
    description: advanced ? '完成一组限时阅读训练。' : '熟悉阅读中常见的同义替换。',
    resourceId: 'reading:538-keywords',
    route: '/learn/reading',
    minutes,
  }
}

function writing(minutes: number): TaskTemplateItem {
  return {
    type: 'writing',
    title: '写作训练 · 今日题目',
    description: '按当前阶段完成段落、Task 1 或 Task 2 训练。',
    resourceId: 'writing:daily-task',
    route: '/learn/writing',
    minutes,
  }
}

function mixedReview(minutes: number): TaskTemplateItem {
  return {
    type: 'vocabulary-review',
    title: '错题与薄弱项复习',
    description: '复盘近期词汇和训练中的薄弱内容。',
    resourceId: 'vocabulary:due-review',
    route: '/review',
    minutes,
    reviewRequired: true,
  }
}

export function getSixtyMinuteTemplate(stage: LearningStage, dayNumber: number): TaskTemplateItem[] {
  if (stage === 'foundation') {
    return [
      vocabularyReview(8),
      vocabularyNew(15, 18),
      grammar(10, dayNumber),
      listening(15),
      reading(12),
    ]
  }

  if (stage === 'ielts-5') {
    return [
      vocabularyReview(10),
      vocabularyNew(10, 12),
      listening(15),
      reading(15),
      dayNumber % 2 === 0 ? writing(10) : grammar(10, dayNumber),
    ]
  }

  if (stage === 'ielts-5.5') {
    return [
      vocabularyReview(10),
      listening(15, true),
      reading(15),
      writing(15),
      vocabularyNew(5, 6),
    ]
  }

  if (stage === 'ielts-6') {
    return [
      listening(15, true),
      reading(15, true),
      writing(20),
      mixedReview(10),
    ]
  }

  return [
    listening(15, true),
    reading(15, true),
    writing(20),
    mixedReview(10),
  ]
}

export function getExtensionTasks(stage: LearningStage, dayNumber: number): TaskTemplateItem[] {
  if (stage === 'foundation' || stage === 'ielts-5')
    return [writing(15), listening(15)]

  if (stage === 'ielts-5.5')
    return [grammar(15, dayNumber), listening(15, true)]

  return [reading(15, true), listening(15, true)]
}
