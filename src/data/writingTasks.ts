import type { ExamType, LearningStage } from '~/types/study'

export interface WritingTaskDefinition {
  id: string
  level: 'foundation' | 'ielts'
  examType: ExamType | 'both'
  taskType: '基础段落' | 'Task 1' | 'Task 2'
  title: string
  prompt: string
  suggestedMinutes: number
  minimumWords: number
  outline: string[]
}

export const WRITING_TASKS: WritingTaskDefinition[] = [
  { id: 'habit-paragraph', level: 'foundation', examType: 'both', taskType: '基础段落', title: '习惯与学习', prompt: 'Write a short paragraph about one study habit you want to develop and explain why it is useful.', suggestedMinutes: 15, minimumWords: 80, outline: ['说明你想培养的习惯', '解释它为什么有帮助', '写出你准备如何坚持'] },
  { id: 'city-transport', level: 'foundation', examType: 'both', taskType: '基础段落', title: '城市交通', prompt: 'Describe one transport problem in your city and suggest a practical solution.', suggestedMinutes: 15, minimumWords: 100, outline: ['描述问题', '说明问题造成的影响', '提出一个可行办法'] },
  { id: 'online-learning', level: 'foundation', examType: 'both', taskType: '基础段落', title: '线上学习', prompt: 'What is one advantage and one disadvantage of learning online?', suggestedMinutes: 15, minimumWords: 100, outline: ['给出一个优点和例子', '给出一个缺点和例子', '写一句总结'] },
  { id: 'academic-line-transport', level: 'ielts', examType: 'academic', taskType: 'Task 1', title: '通勤方式变化', prompt: 'The table below shows the percentage of commuters using four forms of transport in a city in 2000 and 2025. Car: 52% to 38%; bus: 24% to 27%; rail: 14% to 23%; bicycle: 10% to 12%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', suggestedMinutes: 20, minimumWords: 150, outline: ['改写题目', '给出总体趋势概述', '比较主要上升与下降', '补充关键数据'] },
  { id: 'academic-process-water', level: 'ielts', examType: 'academic', taskType: 'Task 1', title: '雨水回收流程', prompt: 'The diagram shows a household rainwater recycling system. Rainwater is collected from the roof, passes through a filter, enters an underground storage tank, is pumped through a treatment unit, and is then supplied to toilets and washing machines. Summarise the process by selecting and reporting the main features.', suggestedMinutes: 20, minimumWords: 150, outline: ['介绍流程用途', '概述起点、终点和主要阶段', '按顺序描述收集与过滤', '描述储存、处理和使用'] },
  { id: 'general-formal-course', level: 'ielts', examType: 'general', taskType: 'Task 1', title: '课程投诉信', prompt: 'You recently attended a short training course, but the course did not meet the description in the advertisement. Write a letter to the course organiser. In your letter, describe the course, explain the problems, and say what you would like the organiser to do.', suggestedMinutes: 20, minimumWords: 150, outline: ['说明写信目的', '交代课程信息', '描述问题及影响', '提出解决要求'] },
  { id: 'general-informal-visit', level: 'ielts', examType: 'general', taskType: 'Task 1', title: '邀请朋友来访', prompt: 'A friend is planning to visit your city. Write a letter to your friend. In your letter, suggest a suitable time to visit, recommend a place to stay, and describe activities you can do together.', suggestedMinutes: 20, minimumWords: 150, outline: ['友好开场', '建议时间并解释', '推荐住宿', '安排共同活动'] },
  { id: 'public-parks', level: 'ielts', examType: 'both', taskType: 'Task 2', title: '公共空间', prompt: 'Some people believe cities should spend more money on public parks than on new roads. To what extent do you agree or disagree?', suggestedMinutes: 40, minimumWords: 250, outline: ['引言：改写题目并表明立场', '主体段：解释主要理由', '主体段：回应另一种观点', '结论：重申立场'] },
  { id: 'technology-communication', level: 'ielts', examType: 'both', taskType: 'Task 2', title: '科技与交流', prompt: 'Technology has changed the way people communicate. Do the advantages of this development outweigh the disadvantages?', suggestedMinutes: 40, minimumWords: 250, outline: ['引言：界定讨论范围', '主体段：优势与例子', '主体段：劣势与权衡', '结论：给出判断'] },
  { id: 'education-skills', level: 'ielts', examType: 'both', taskType: 'Task 2', title: '教育与技能', prompt: 'Some people think schools should focus only on academic subjects, while others believe practical life skills should also be taught. Discuss both views and give your own opinion.', suggestedMinutes: 40, minimumWords: 250, outline: ['引言：介绍两种观点', '主体段：学术科目的价值', '主体段：生活技能的价值', '结论：你的观点'] },
]

export const WRITING_CONNECTORS = ['To begin with', 'For example', 'In addition', 'However', 'As a result', 'In conclusion']

export function selectWritingTask(stage: LearningStage, dayNumber: number, examType: ExamType = 'academic') {
  const level = stage === 'foundation' || stage === 'ielts-5' ? 'foundation' : 'ielts'
  const candidates = WRITING_TASKS.filter(task => task.level === level && (task.examType === 'both' || task.examType === examType))
  return candidates[(dayNumber - 1) % candidates.length]
}
