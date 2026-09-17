import { describe, expect, it } from 'vitest'
import { STUDY_STORAGE_KEY, createDefaultStudyData, importStudyData, loadStudyData, saveStudyData } from '../../src/services/studyStorage'
import type { StorageLike } from '../../src/services/studyStorage'

function memoryStorage(): StorageLike {
  const values = new Map<string, string>()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
}

describe('study storage', () => {
  it('returns safe defaults for missing or broken data', () => {
    const storage = memoryStorage()
    expect(loadStudyData(storage).progress.courseDay).toBe(1)
    storage.setItem(STUDY_STORAGE_KEY, '{broken')
    expect(loadStudyData(storage).schemaVersion).toBe(1)
    expect(loadStudyData(storage).vocabularyProgress).toEqual({})
  })

  it('round-trips versioned study data', () => {
    const storage = memoryStorage()
    const data = createDefaultStudyData()
    data.progress.courseDay = 7
    saveStudyData(data, storage)
    expect(loadStudyData(storage).progress.courseDay).toBe(7)
  })

  it('rejects unrelated JSON imports', () => {
    expect(importStudyData('{"hello":"world"}').ok).toBe(false)
  })

  it('rejects structurally corrupted study data', () => {
    const data = createDefaultStudyData() as unknown as Record<string, unknown>
    data.activePlan = 'not-a-plan'
    expect(importStudyData(JSON.stringify(data)).ok).toBe(false)
  })
})
