<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { getReadingLesson, isReadingAnswerCorrect, readingExpectedAnswer, selectReadingLesson } from '~/data/readingLessons'

const route = useRoute()
const studyStore = useStudyStore()
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const requestedLesson = typeof route.query.lesson === 'string' ? route.query.lesson : undefined
const lesson = getReadingLesson(requestedLesson)
  ?? selectReadingLesson(studyStore.progress.value.currentStage, studyStore.state.skillAttempts, studyStore.progress.value.courseDay)
const answers = ref<Array<number | string | null>>(lesson.questions.map(question => question.type === 'text' ? '' : null))
const submitted = ref(false)
const startedAt = Date.now()
const elapsedSeconds = ref(0)
const timer = window.setInterval(() => elapsedSeconds.value = Math.round((Date.now() - startedAt) / 1000), 1000)
const answered = computed(() => answers.value.filter(answer => typeof answer === 'string' ? Boolean(answer.trim()) : answer !== null).length)
const score = computed(() => lesson.questions.filter((question, index) => isReadingAnswerCorrect(question, answers.value[index])).length)

function submit() {
  if (answered.value !== lesson.questions.length)
    return
  submitted.value = true
  window.clearInterval(timer)
  lesson.questions.forEach((question, index) => studyStore.recordQuestionResult({
    resourceId: `reading:${lesson.id}`,
    type: 'reading',
    questionId: question.id,
    title: lesson.title,
    route: `/learn/reading?lesson=${encodeURIComponent(lesson.id)}`,
    correct: isReadingAnswerCorrect(question, answers.value[index]),
  }))
  const accuracy = Math.round(score.value / lesson.questions.length * 100)
  studyStore.addSkillAttempt({ type: 'reading', resourceId: `reading:${lesson.id}`, durationSeconds: elapsedSeconds.value, accuracy, score: score.value })
  studyStore.completeTaskWithResult(taskId, { score: score.value, accuracy, reviewRequired: accuracy < 80 })
}

onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>
    <header class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
          短篇阅读 · 难度 {{ lesson.difficulty }}
        </p><h1 class="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
          {{ lesson.title }}
        </h1>
      </div>
      <span class="rounded-full bg-gray-100 px-4 py-2 text-sm font-mono text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ Math.floor(elapsedSeconds / 60) }}:{{ String(elapsedSeconds % 60).padStart(2, '0') }}</span>
    </header>

    <article class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 leading-8 text-gray-700 dark:border-gray-700 dark:bg-gray-800 sm:p-8 dark:text-gray-200">
      {{ lesson.passage }}
    </article>

    <section class="mt-6 space-y-4">
      <article v-for="(question, questionIndex) in lesson.questions" :key="question.id" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="font-semibold text-gray-950 dark:text-white">
          {{ questionIndex + 1 }}. {{ question.prompt }}
        </h2>
        <p v-if="question.instruction" class="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          {{ question.instruction }}
        </p>
        <div v-if="question.type !== 'text'" class="grid mt-4 gap-2 sm:grid-cols-2">
          <button
            v-for="(option, optionIndex) in question.options ?? []" :key="option" class="border rounded-lg px-4 py-3 text-left text-sm" :disabled="submitted" :class="[
              answers[questionIndex] === optionIndex ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700',
              submitted && optionIndex === question.answer ? '!border-green-600 !bg-green-50 dark:!bg-green-950/30' : '',
              submitted && answers[questionIndex] === optionIndex && optionIndex !== question.answer ? '!border-red-500 !bg-red-50 dark:!bg-red-950/30' : '',
            ]" @click="answers[questionIndex] = optionIndex"
          >
            {{ option }}
          </button>
        </div>
        <input v-else v-model="answers[questionIndex]" type="text" class="mt-4 w-full border border-gray-300 rounded-xl bg-transparent px-4 py-3 outline-none dark:border-gray-600 focus:border-primary-500" :disabled="submitted" placeholder="输入答案">
        <p v-if="submitted && !isReadingAnswerCorrect(question, answers[questionIndex])" class="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
          推荐答案：{{ readingExpectedAnswer(question) }}
        </p>
        <p v-if="submitted" class="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {{ question.explanation }}
        </p>
      </article>
    </section>

    <button v-if="!submitted" class="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white disabled:opacity-40" :disabled="answered !== lesson.questions.length" @click="submit">
      提交阅读结果
    </button>
    <div v-else class="dark:bg-primary-950/30 mt-6 rounded-2xl bg-primary-50 p-6 text-center">
      <p class="text-3xl font-bold text-gray-950 dark:text-white">
        正确率 {{ Math.round(score / lesson.questions.length * 100) }}%
      </p><p class="mt-2 text-gray-600 dark:text-gray-300">
        用时 {{ Math.ceil(elapsedSeconds / 60) }} 分钟，错题已安排复习。
      </p><RouterLink to="/" class="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
        回到今日学习
      </RouterLink>
    </div>
  </div>
</template>
