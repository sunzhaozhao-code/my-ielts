<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { getGrammarLesson } from '~/data/grammarLessons'

const route = useRoute()
const studyStore = useStudyStore()
const topic = typeof route.query.topic === 'string' ? route.query.topic : undefined
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const lesson = getGrammarLesson(topic)
const answers = ref<Array<number | null>>(lesson.questions.map(() => null))
const submitted = ref(false)

const answered = computed(() => answers.value.filter(answer => answer !== null).length)
const score = computed(() => lesson.questions.filter((question, index) => answers.value[index] === question.answer).length)

function submit() {
  if (answered.value !== lesson.questions.length)
    return
  submitted.value = true
  lesson.questions.forEach((question, index) => {
    studyStore.recordQuestionResult({
      resourceId: `grammar:${lesson.id}`,
      type: 'grammar',
      questionId: question.id,
      title: lesson.title,
      route: `/learn/grammar?topic=${encodeURIComponent(lesson.title)}`,
      correct: answers.value[index] === question.answer,
    })
  })
  const accuracy = Math.round(score.value / lesson.questions.length * 100)
  studyStore.addSkillAttempt({ type: 'grammar', resourceId: `grammar:${lesson.id}`, durationSeconds: 0, accuracy, score: score.value })
  studyStore.completeTaskWithResult(taskId, { score: score.value, accuracy, reviewRequired: accuracy < 80 })
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>
    <header class="mt-6">
      <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
        今日语法
      </p>
      <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        {{ lesson.title }}
      </h1>
    </header>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="font-bold text-gray-950 dark:text-white">
        中文说明
      </h2>
      <p class="mt-3 leading-7 text-gray-600 dark:text-gray-300">
        {{ lesson.summary }}
      </p>
      <div class="grid mt-5 gap-3 sm:grid-cols-2">
        <div v-for="example in lesson.examples" :key="example.english" class="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60">
          <p class="font-medium text-gray-950 dark:text-white">
            {{ example.english }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ example.chinese }}
          </p>
        </div>
      </div>
    </section>

    <section class="mt-6 space-y-4">
      <article v-for="(question, questionIndex) in lesson.questions" :key="question.id" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="font-semibold text-gray-950 dark:text-white">
          {{ questionIndex + 1 }}. {{ question.prompt }}
        </h2>
        <div class="grid mt-4 gap-2 sm:grid-cols-2">
          <button
            v-for="(option, optionIndex) in question.options" :key="option" class="border rounded-lg px-4 py-3 text-left text-sm transition" :disabled="submitted" :class="[
              answers[questionIndex] === optionIndex ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700',
              submitted && optionIndex === question.answer ? '!border-green-600 !bg-green-50 dark:!bg-green-950/30' : '',
              submitted && answers[questionIndex] === optionIndex && optionIndex !== question.answer ? '!border-red-500 !bg-red-50 dark:!bg-red-950/30' : '',
            ]" @click="answers[questionIndex] = optionIndex"
          >
            {{ option }}
          </button>
        </div>
        <p v-if="submitted" class="mt-3 text-sm leading-6" :class="answers[questionIndex] === question.answer ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
          {{ question.explanation }}
        </p>
      </article>
    </section>

    <button v-if="!submitted" class="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white disabled:opacity-40" :disabled="answered !== lesson.questions.length" @click="submit">
      {{ answered === lesson.questions.length ? '提交并判分' : `还需完成 ${lesson.questions.length - answered} 题` }}
    </button>
    <div v-else class="dark:bg-primary-950/30 mt-6 rounded-2xl bg-primary-50 p-6 text-center">
      <p class="text-3xl font-bold text-gray-950 dark:text-white">
        {{ score }} / {{ lesson.questions.length }}
      </p>
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        错题已经自动进入复习。
      </p>
      <RouterLink to="/" class="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
        回到今日学习
      </RouterLink>
    </div>
  </div>
</template>
