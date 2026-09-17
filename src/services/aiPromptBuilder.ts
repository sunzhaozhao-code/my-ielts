import type { ExamType } from '~/types/study'

interface WritingPromptInput {
  examType: ExamType
  taskType: string
  question: string
  userAnswer: string
  wordCount: number
  minimumWords: number
}

export function buildWritingReviewPrompt(input: WritingPromptInput) {
  const examLabel = input.examType === 'academic' ? 'IELTS Academic' : 'IELTS General Training'
  return `你是一名严格但具有教学性的 IELTS 写作考官和中文教师。

请按照 IELTS 官方写作评分标准批改下面的作文。评分只作为学习参考，不应声称是官方成绩。

考试类型：${examLabel}
写作任务：${input.taskType}

题目：
${input.question}

考生作文：
<essay>
${input.userAnswer}
</essay>

作文字数：${input.wordCount}
最低字数要求：${input.minimumWords}

请完成以下任务：
1. 检查作文是否完整回应题目，是否跑题或遗漏要求。
2. 分别按照 Task Achievement / Task Response、Coherence and Cohesion、Lexical Resource、Grammatical Range and Accuracy 评分。
3. 每项给出 0～9 分，允许 0.5 分，并给出预估总分。
4. 所有扣分都说明具体原因；引用原文时只引用需要修改的小段。
5. 找出最重要的语法、用词、结构和论证问题，给出修改表达并用中文解释。
6. 优先教我改进自己的文章，不要只提供一篇完全不同的范文。
7. 不得虚构图表数据或题目没有提供的信息。

请严格按以下格式输出：

## 预估成绩
- Task Achievement / Task Response：X.X
- Coherence and Cohesion：X.X
- Lexical Resource：X.X
- Grammatical Range and Accuracy：X.X
- 预估总分：X.X

## 总体评价

## 任务完成情况

## 结构与衔接

## 词汇问题
| 原表达 | 建议表达 | 问题和原因 |
|---|---|---|

## 语法问题
| 原句或片段 | 修改后 | 中文解释 |
|---|---|---|

## 最需要修改的 5 个问题
1.
2.
3.
4.
5.

## 建议修改步骤

## 参考修改稿
尽量保留考生原意，不要添加题目没有提供的数据。

## 下一次训练重点
列出 3 个下一篇作文应重点练习的能力。`
}

export function buildWritingRevisionPrompt(input: WritingPromptInput & { originalAnswer: string; previousFeedback: string }) {
  return `你是一名 IELTS 写作教师。请判断修改稿是否真正解决了第一次批改指出的问题，不要因为文字变长或替换高级词汇就自动提高分数。

考试类型：${input.examType === 'academic' ? 'IELTS Academic' : 'IELTS General Training'}
任务类型：${input.taskType}
题目：${input.question}

<original>
${input.originalAnswer}
</original>

<previous-feedback>
${input.previousFeedback}
</previous-feedback>

<revision>
${input.userAnswer}
</revision>

请按以下格式输出：
## 分数变化
| 评分项目 | 原预估分 | 修改后预估分 | 变化原因 |
|---|---:|---:|---|

## 已解决的问题
## 仍然存在的问题
## 新出现的问题
## 需要再次修改的句子
| 当前表达 | 建议修改 | 原因 |
|---|---|---|
## 下一版修改任务`
}

export function buildGrammarReviewPrompt(input: { topic: string; question: string; instruction: string; userAnswer: string }) {
  return `你是一名面向中文 IELTS 学习者的英语语法教师。

语法知识点：${input.topic}
题目：${input.question}
要求：${input.instruction}
学习者答案：${input.userAnswer}

请判断答案是“正确 / 基本正确 / 错误”，标出具体语法错误，用简洁中文解释，给出正确答案和两个相似例句，并说明是否建议加入复习。若有多个正确表达，请全部承认。`
}

export function buildReadingShortAnswerReviewPrompt(input: { passage: string; question: string; instruction: string; acceptableAnswers: string[]; userAnswer: string }) {
  return `你是一名 IELTS 阅读教师。

<passage>
${input.passage}
</passage>

题目：${input.question}
题目要求：${input.instruction}
可接受答案：${input.acceptableAnswers.join(' / ')}
学习者答案：${input.userAnswer}

请判断答案含义、字数限制、单复数和拼写是否符合要求。如果错误，说明原文证据、正确推理过程和关键同义替换。输出“正确 / 错误 / 存在争议”以及推荐答案。`
}
