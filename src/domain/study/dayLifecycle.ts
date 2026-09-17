import { getNextAvailableStage, getStage } from '~/data/stages'
import type { LearningProgress, LearningStage } from '~/types/study'

export function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function dayDistance(from: string, to: string) {
  const milliseconds = parseLocalDate(to).getTime() - parseLocalDate(from).getTime()
  return Math.round(milliseconds / 86_400_000)
}

export function addDays(dateKey: string, days: number) {
  const date = parseLocalDate(dateKey)
  date.setDate(date.getDate() + days)
  return toLocalDateKey(date)
}

export function registerStudyDate(progress: LearningProgress, dateKey: string) {
  if (progress.studyDates.includes(dateKey))
    return

  const previousDate = progress.studyDates.at(-1)
  progress.studyDates.push(dateKey)
  progress.completedStudyDays = progress.studyDates.length
  progress.streakDays = previousDate && dayDistance(previousDate, dateKey) === 1
    ? progress.streakDays + 1
    : 1
}

export function advanceStage(progress: LearningProgress, completedMinutes = 60, targetStage?: LearningStage, eligible = true) {
  const stage = getStage(progress.currentStage)
  if (!stage.available || stage.courseDaysAt60 <= 0)
    return

  const maximum = eligible ? 100 : 99
  progress.stageProgress = Math.min(maximum, progress.stageProgress + completedMinutes / (stage.courseDaysAt60 * 60) * 100)
  if (progress.stageProgress < 100)
    return

  if (targetStage && progress.currentStage === targetStage) {
    progress.stageProgress = 100
    return
  }

  const nextStage = getNextAvailableStage(progress.currentStage)
  if (nextStage) {
    progress.currentStage = nextStage
    progress.stageProgress = 0
  }
}
