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
  _dayNumber: number,
) {
  const allWords = getAllVocabularyWords()

  if (mode === 'review') {
    const wordById = new Map(allWords.map(word => [word.id, word]))
    const dueIds = Object.values(progress)
      .filter(item => item.nextReviewDate <= dateKey && item.status !== 'mastered')
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
      .map(item => item.wordId)
    const due = dueIds.map(id => wordById.get(id)).filter((word): word is VocabularyWord => Boolean(word))
    return due.slice(0, count)
  }

  const unseen = allWords.filter(word => !progress[`vocabulary:${word.id}`])
  if (unseen.length >= count)
    return unseen.slice(0, count)

  const seenNotMastered = allWords.filter((word) => {
    const item = progress[`vocabulary:${word.id}`]
    return item && item.status !== 'mastered'
  })
  return [...unseen, ...seenNotMastered].slice(0, count)
}
