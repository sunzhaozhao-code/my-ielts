import type { LearningStage } from '~/types/study'

export interface WritingTaskDefinition {
  id: string
  level: 'foundation' | 'ielts'
  title: string
  prompt: string
  suggestedMinutes: number
  suggestedWords: number
  outline: string[]
}

export const WRITING_TASKS: WritingTaskDefinition[] = [
  { id: 'habit-paragraph', level: 'foundation', title: '习惯与学习', prompt: 'Write a short paragraph about one study habit you want to develop and explain why it is useful.', suggestedMinutes: 15, suggestedWords: 80, outline: ['说明你想培养的习惯', '解释它为什么有帮助', '写出你准备如何坚持'] },
  { id: 'city-transport', level: 'foundation', title: '城市交通', prompt: 'Describe one transport problem in your city and suggest a practical solution.', suggestedMinutes: 15, suggestedWords: 100, outline: ['描述问题', '说明问题造成的影响', '提出一个可行办法'] },
  { id: 'online-learning', level: 'foundation', title: '线上学习', prompt: 'What is one advantage and one disadvantage of learning online?', suggestedMinutes: 15, suggestedWords: 100, outline: ['给出一个优点和例子', '给出一个缺点和例子', '写一句总结'] },
  { id: 'public-parks', level: 'ielts', title: '公共空间', prompt: 'Some people believe cities should spend more money on public parks than on new roads. To what extent do you agree or disagree?', suggestedMinutes: 20, suggestedWords: 180, outline: ['引言：改写题目并表明立场', '主体段：解释主要理由', '主体段：回应另一种观点', '结论：重申立场'] },
  { id: 'technology-communication', level: 'ielts', title: '科技与交流', prompt: 'Technology has changed the way people communicate. Do the advantages of this development outweigh the disadvantages?', suggestedMinutes: 20, suggestedWords: 180, outline: ['引言：界定讨论范围', '主体段：优势与例子', '主体段：劣势与权衡', '结论：给出判断'] },
  { id: 'education-skills', level: 'ielts', title: '教育与技能', prompt: 'Schools should teach practical life skills as well as academic subjects. Discuss both views and give your own opinion.', suggestedMinutes: 20, suggestedWords: 180, outline: ['引言：介绍两种观点', '主体段：学术科目的价值', '主体段：生活技能的价值', '结论：你的观点'] },
]

export const WRITING_CONNECTORS = ['To begin with', 'For example', 'In addition', 'However', 'As a result', 'In conclusion']

export function selectWritingTask(stage: LearningStage, dayNumber: number) {
  const level = stage === 'foundation' || stage === 'ielts-5' ? 'foundation' : 'ielts'
  const candidates = WRITING_TASKS.filter(task => task.level === level)
  return candidates[(dayNumber - 1) % candidates.length]
}
