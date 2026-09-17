import { describe, expect, it } from 'vitest'
import { buildGrammarReviewPrompt, buildReadingShortAnswerReviewPrompt, buildWritingReviewPrompt } from '../../src/services/aiPromptBuilder'

describe('AI prompt builder', () => {
  it('includes the writing task, answer, rubric and word count', () => {
    const prompt = buildWritingReviewPrompt({
      examType: 'academic',
      taskType: 'Task 2',
      question: 'Discuss both views.',
      userAnswer: 'My answer.',
      wordCount: 2,
      minimumWords: 250,
    })

    expect(prompt).toContain('IELTS Academic')
    expect(prompt).toContain('Discuss both views.')
    expect(prompt).toContain('<essay>\nMy answer.\n</essay>')
    expect(prompt).toContain('Grammatical Range and Accuracy')
    expect(prompt).toContain('最低字数要求：250')
  })

  it('builds standalone grammar and reading review prompts', () => {
    expect(buildGrammarReviewPrompt({ topic: '冠词', question: 'Fill the blank', instruction: 'Use an article', userAnswer: 'a' })).toContain('冠词')
    expect(buildReadingShortAnswerReviewPrompt({ passage: 'A short text.', question: 'What?', instruction: 'ONE WORD', acceptableAnswers: ['text'], userAnswer: 'text' })).toContain('ONE WORD')
  })
})
