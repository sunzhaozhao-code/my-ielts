import vocabulary from '~/pages/vocabulary/vocabulary'
import type { VocabularyProgress } from '~/types/study'

export interface VocabularyWord {
  id: number
  chapter: string
  words: string[]
  pos: string
  meaning: string
  example: string
  extra: string
}

export function getAllVocabularyWords(): VocabularyWord[] {
  return Object.entries(vocabulary as Record<string, any>).flatMap(([chapter, data]) => (
    data.words.flat().map((item: any) => ({
      id: item.id,
      chapter,
      words: item.word,
      pos: item.pos,
      meaning: item.meaning,
      example: item.example,
      extra: item.extra,
    }))
  ))
}

export function createVocabularySession(
  progress: Record<string, VocabularyProgress>,
  mode: 'new' | 'review',
  count: number,
  dateKey: string,
  dayNumber: number,
) {
  const allWords = getAllVocabularyWords()

  if (mode === 'review') {
    const dueIds = new Set(Object.values(progress)
      .filter(item => item.nextReviewDate <= dateKey && item.status !== 'mastered')
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
      .map(item => item.wordId))
    const due = allWords.filter(word => dueIds.has(word.id))
    const learning = allWords.filter(word => progress[`vocabulary:${word.id}`] && !dueIds.has(word.id))
    const unseen = allWords.filter(word => !progress[`vocabulary:${word.id}`])
    return [...due, ...learning, ...unseen].slice(0, count)
  }

  const unseen = allWords.filter(word => !progress[`vocabulary:${word.id}`])
  if (unseen.length >= count) {
    const start = ((dayNumber - 1) * count) % unseen.length
    return [...unseen.slice(start), ...unseen.slice(0, start)].slice(0, count)
  }

  return [...unseen, ...allWords.filter(word => progress[`vocabulary:${word.id}`]?.status !== 'mastered')].slice(0, count)
}
