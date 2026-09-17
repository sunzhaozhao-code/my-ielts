import { getExtensionTasks, getSixtyMinuteTemplate } from '~/data/taskTemplates'
import type { DailyMinutes, DailyPlan, DailyTask, LearningStage, TaskTemplateItem } from '~/types/study'

function cloneTemplate(item: TaskTemplateItem): TaskTemplateItem {
  return { ...item }
}

function selectForShortSession(items: TaskTemplateItem[], minutes: 30 | 45, dayNumber: number) {
  if (minutes === 45) {
    const removable = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.reviewRequired)
    const removeIndex = removable[(dayNumber - 1) % removable.length]?.index ?? items.length - 1
    const selected = items.filter((_, index) => index !== removeIndex)
    return selected.length >= 3 ? selected : items.slice(0, 3)
  }

  const review = items.find(item => item.reviewRequired) ?? items[0]
  const nonVocabulary = items.filter(item => !item.type.startsWith('vocabulary'))
  const rotating = nonVocabulary[(dayNumber - 1) % Math.max(1, nonVocabulary.length)]
  const newVocabulary = items.find(item => item.type === 'vocabulary-new')
  return [review, newVocabulary, rotating].filter((item): item is TaskTemplateItem => Boolean(item))
}

function rebalanceMinutes(items: TaskTemplateItem[], budget: number) {
  const selected = items.map(cloneTemplate)
  const currentTotal = selected.reduce((sum, item) => sum + item.minutes, 0)
  if (!currentTotal)
    return selected

  let assigned = 0
  selected.forEach((item, index) => {
    if (index === selected.length - 1) {
      item.minutes = Math.max(1, budget - assigned)
      return
    }

    item.minutes = Math.max(3, Math.round(item.minutes / currentTotal * budget))
    assigned += item.minutes
  })
  return selected
}

export function getTaskTemplate(stage: LearningStage, dailyMinutes: DailyMinutes, dayNumber: number) {
  const base = getSixtyMinuteTemplate(stage, dayNumber)
  if (dailyMinutes === 60)
    return base

  if (dailyMinutes === 90)
    return [...base, ...getExtensionTasks(stage, dayNumber)]

  return rebalanceMinutes(selectForShortSession(base, dailyMinutes, dayNumber), dailyMinutes)
}

export function createDailyPlan(
  stage: LearningStage,
  dailyMinutes: DailyMinutes,
  dayNumber: number,
  assignedDate: string,
  now = new Date(),
): DailyPlan {
  const templates = getTaskTemplate(stage, dailyMinutes, dayNumber)
  const tasks: DailyTask[] = templates.map((template, index) => {
    const id = `day-${dayNumber}-${index + 1}`
    const separator = template.route.includes('?') ? '&' : '?'
    return {
      id,
      date: assignedDate,
      dayNumber,
      sequence: index + 1,
      type: template.type,
      title: template.title,
      description: template.description,
      resourceId: template.resourceId,
      route: `${template.route}${separator}task=${id}`,
      estimatedMinutes: template.minutes,
      status: 'pending',
      reviewRequired: template.reviewRequired ?? false,
      targetCount: template.targetCount,
    }
  })

  return {
    id: `day-${dayNumber}`,
    dayNumber,
    assignedDate,
    stage,
    estimatedMinutes: tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0),
    status: 'active',
    tasks,
    createdAt: now.toISOString(),
  }
}
