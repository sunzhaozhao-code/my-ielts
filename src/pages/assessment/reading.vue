<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { getReadingAssessment } from '~/data/readingAssessments'
import { isReadingAnswerCorrect, readingExpectedAnswer } from '~/data/readingLessons'

const studyStore = useStudyStore()
const assessment = getReadingAssessment(studyStore.progress.value.currentStage)
const answers = reactive<Record<string, number | string | null>>(Object.fromEntries(
  assessment.lessons.flatMap(lesson => lesson.questions.map(question => [question.id, question.type === 'text' ? '' : null])),
))
const remainingSeconds = ref(assessment.durationMinutes * 60)
const submitted = ref(false)
const startedAt = Date.now()

const allQuestions = computed(() => assessment.lessons.flatMap(lesson => lesson.questions.map(question => ({ lesson, question }))))
const answeredCount = computed(() => allQuestions.value.filter(({ question }) => {
  const answer = answers[question.id]
  return typeof answer === 'string' ? Boolean(answer.trim()) : answer !== null
}).length)
const score = computed(() => allQuestions.value.filter(({ question }) => isReadingAnswerCorrect(question, answers[question.id])).length)
const accuracy = computed(() => Math.round(score.value / assessment.questionCount * 100))

let timer: number | null = null
function stopTimer() {
  if (timer !== null)
    window.clearInterval(timer)
  timer = null
}

function submit() {
  if (submitted.value)
    return
  submitted.value = true
  stopTimer()
  allQuestions.value.forEach(({ lesson, question }) => studyStore.recordQuestionResult({
    resourceId: `reading:${lesson.id}`,
    type: 'reading',
    questionId: question.id,
    title: lesson.title,
    route: `/learn/reading?lesson=${encodeURIComponent(lesson.id)}`,
    correct: isReadingAnswerCorrect(question, answers[question.id]),
  }))
  studyStore.addSkillAttempt({
    type: 'reading',
    resourceId: `reading:assessment:${assessment.id}`,
    durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    accuracy: accuracy.value,
    score: score.value,
  })
}

onMounted(() => {
  timer = window.setInterval(() => {
    remainingSeconds.value--
    if (remainingSeconds.value <= 0)
      submit()
  }, 1000)
})
onUnmounted(stopTimer)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <RouterLink to="/roadmap" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回学习路线
    </RouterLink>
    <header class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">阶段诊断 · 非官方模考</p>
        <h1 class="mt-1 text-3xl font-bold text-gray-950 dark:text-white">{{ assessment.title }}</h1>
        <p class="mt-3 text-gray-500 dark:text-gray-400">{{ assessment.lessons.length }} 篇文章 · {{ assessment.questionCount }} 题 · 建议 {{ assessment.durationMinutes }} 分钟</p>
      </div>
      <div class="rounded-xl bg-gray-100 px-4 py-2 font-mono text-lg font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
        {{ Math.floor(Math.max(0, remainingSeconds) / 60) }}:{{ String(Math.max(0, remainingSeconds) % 60).padStart(2, '0') }}
      </div>
    </header>

    <div class="mt-8 space-y-10">
      <section v-for="(lesson, passageIndex) in assessment.lessons" :key="lesson.id">
        <div class="border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary-600">Passage {{ passageIndex + 1 }}</p>
          <h2 class="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{{ lesson.title }}</h2>
          <p class="mt-5 whitespace-pre-line leading-8 text-gray-700 dark:text-gray-200">{{ lesson.passage }}</p>
        </div>

        <div class="mt-4 space-y-3">
          <article v-for="(question, questionIndex) in lesson.questions" :key="question.id" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h3 class="font-semibold text-gray-950 dark:text-white">{{ questionIndex + 1 }}. {{ question.prompt }}</h3>
            <p v-if="question.instruction" class="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">{{ question.instruction }}</p>
            <div v-if="question.type !== 'text'" class="grid mt-4 gap-2 sm:grid-cols-2">
              <button
                v-for="(option, optionIndex) in question.options ?? []" :key="option" class="border rounded-lg px-4 py-3 text-left text-sm" :disabled="submitted" :class="[
                  answers[question.id] === optionIndex ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700',
                  submitted && optionIndex === question.answer ? '!border-green-600 !bg-green-50 dark:!bg-green-950/30' : '',
                  submitted && answers[question.id] === optionIndex && optionIndex !== question.answer ? '!border-red-500 !bg-red-50 dark:!bg-red-950/30' : '',
                ]" @click="answers[question.id] = optionIndex"
              >{{ option }}</button>
            </div>
            <input v-else v-model="answers[question.id]" type="text" class="mt-4 w-full border border-gray-300 rounded-xl bg-transparent px-4 py-3 outline-none dark:border-gray-600 focus:border-primary-500" :disabled="submitted" placeholder="输入答案">
            <div v-if="submitted" class="mt-3 text-sm">
              <p :class="isReadingAnswerCorrect(question, answers[question.id]) ? 'text-green-600' : 'text-red-600'">
                {{ isReadingAnswerCorrect(question, answers[question.id]) ? '回答正确' : `推荐答案：${readingExpectedAnswer(question)}` }}
              </p>
              <p class="mt-1 text-gray-500 dark:text-gray-400">{{ question.explanation }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>

    <button v-if="!submitted" class="mt-8 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white" @click="submit">
      提交测评（已答 {{ answeredCount }} / {{ assessment.questionCount }}）
    </button>
    <section v-else class="mt-8 rounded-2xl bg-primary-50 p-7 text-center dark:bg-primary-950/30">
      <p class="text-sm text-gray-500">本次阶段诊断</p>
      <p class="mt-2 text-4xl font-bold text-gray-950 dark:text-white">{{ score }} / {{ assessment.questionCount }}</p>
      <p class="mt-2 text-lg text-gray-700 dark:text-gray-300">正确率 {{ accuracy }}%，错题已加入复习。</p>
      <p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">这是站内阶段诊断，用于调整学习任务，不等同于官方 IELTS Reading 分数。完整模考仍需使用严格的 60 分钟、3 篇文章和 40 题形式。</p>
      <RouterLink to="/roadmap" class="mt-5 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">查看能力门槛</RouterLink>
    </section>
  </div>
</template>
