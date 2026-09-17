<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { READING_MOCK, READING_MOCK_QUESTION_COUNT } from '~/data/readingMock'
import { isReadingAnswerCorrect, readingExpectedAnswer } from '~/data/readingLessons'
import { clearTimedPracticeSession, loadTimedPracticeSession, saveTimedPracticeSession } from '~/services/timedPracticeSession'

const studyStore = useStudyStore()
const sessionId = `reading-mock:${READING_MOCK.id}`
const defaultAnswers = Object.fromEntries(
  READING_MOCK.passages.flatMap(passage => passage.questions.map(question => [question.id, question.type === 'text' ? '' : null])),
) as Record<string, number | string | null>
const restoredSession = loadTimedPracticeSession(sessionId)
const answers = reactive<Record<string, number | string | null>>({ ...defaultAnswers, ...restoredSession?.answers })
const remainingSeconds = ref(READING_MOCK.durationMinutes * 60)
const submitted = ref(false)
const startedAt = restoredSession?.startedAt ?? Date.now()
const deadline = startedAt + READING_MOCK.durationMinutes * 60 * 1000

const allQuestions = computed(() => READING_MOCK.passages.flatMap(passage => passage.questions.map(question => ({ passage, question }))))
const answeredCount = computed(() => allQuestions.value.filter(({ question }) => {
  const answer = answers[question.id]
  return typeof answer === 'string' ? Boolean(answer.trim()) : answer !== null
}).length)
const score = computed(() => allQuestions.value.filter(({ question }) => isReadingAnswerCorrect(question, answers[question.id])).length)
const accuracy = computed(() => Math.round(score.value / READING_MOCK_QUESTION_COUNT * 100))

function questionNumber(passageIndex: number, questionIndex: number) {
  return READING_MOCK.passages.slice(0, passageIndex).reduce((sum, passage) => sum + passage.questions.length, 0) + questionIndex + 1
}

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
  clearTimedPracticeSession(sessionId)
  allQuestions.value.forEach(({ passage, question }) => studyStore.recordQuestionResult({
    resourceId: `reading-mock:${READING_MOCK.id}`,
    type: 'reading',
    questionId: question.id,
    title: `${READING_MOCK.title} · ${passage.title}`,
    route: '/mock/reading',
    correct: isReadingAnswerCorrect(question, answers[question.id]),
  }))
  studyStore.addSkillAttempt({
    type: 'reading',
    resourceId: `reading:full-mock:${READING_MOCK.id}`,
    durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    accuracy: accuracy.value,
    score: score.value,
  })
}

onMounted(() => {
  saveTimedPracticeSession(sessionId, { startedAt, answers: { ...answers } })
  const updateTimer = () => {
    remainingSeconds.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
    if (remainingSeconds.value <= 0)
      submit()
  }
  updateTimer()
  timer = window.setInterval(updateTimer, 1000)
})
watch(answers, () => saveTimedPracticeSession(sessionId, { startedAt, answers: { ...answers } }), { deep: true })
onUnmounted(stopTimer)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:py-10">
    <RouterLink to="/roadmap" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回学习路线
    </RouterLink>
    <header class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
          完整题量训练 · 站内原创内容
        </p>
        <h1 class="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
          {{ READING_MOCK.title }}
        </h1>
        <p class="mt-3 text-gray-500 dark:text-gray-400">
          3 篇文章 · 40 题 · 60 分钟；建议一次连续完成。
        </p>
      </div>
      <div class="sticky top-20 z-10 rounded-xl bg-gray-900 px-4 py-2 text-lg font-bold font-mono text-white shadow-lg">
        {{ Math.floor(Math.max(0, remainingSeconds) / 60) }}:{{ String(Math.max(0, remainingSeconds) % 60).padStart(2, '0') }}
      </div>
    </header>

    <div class="mt-8 space-y-12">
      <section v-for="(passage, passageIndex) in READING_MOCK.passages" :key="passage.id">
        <article class="border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <p class="text-xs font-semibold tracking-wide uppercase text-primary-600">
            Reading Passage {{ passageIndex + 1 }}
          </p>
          <h2 class="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
            {{ passage.title }}
          </h2>
          <p class="mt-5 leading-8 text-gray-700 dark:text-gray-200">
            {{ passage.passage }}
          </p>
        </article>

        <div class="mt-4 space-y-3">
          <article v-for="(question, questionIndex) in passage.questions" :key="question.id" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h3 class="font-semibold text-gray-950 dark:text-white">
              {{ questionNumber(passageIndex, questionIndex) }}. {{ question.prompt }}
            </h3>
            <p v-if="question.instruction" class="mt-2 text-xs font-medium tracking-wide uppercase text-gray-400">
              {{ question.instruction }}
            </p>
            <div v-if="question.type !== 'text'" class="grid mt-4 gap-2 sm:grid-cols-2">
              <button
                v-for="(option, optionIndex) in question.options ?? []" :key="option" class="border rounded-lg px-4 py-3 text-left text-sm" :disabled="submitted" :class="[
                  answers[question.id] === optionIndex ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700',
                  submitted && optionIndex === question.answer ? '!border-green-600 !bg-green-50 dark:!bg-green-950/30' : '',
                  submitted && answers[question.id] === optionIndex && optionIndex !== question.answer ? '!border-red-500 !bg-red-50 dark:!bg-red-950/30' : '',
                ]" @click="answers[question.id] = optionIndex"
              >
                {{ option }}
              </button>
            </div>
            <input v-else v-model="answers[question.id]" type="text" class="mt-4 w-full border border-gray-300 rounded-xl bg-transparent px-4 py-3 outline-none dark:border-gray-600 focus:border-primary-500" :disabled="submitted" placeholder="输入答案">
            <div v-if="submitted" class="mt-3 text-sm">
              <p :class="isReadingAnswerCorrect(question, answers[question.id]) ? 'text-green-600' : 'text-red-600'">
                {{ isReadingAnswerCorrect(question, answers[question.id]) ? '回答正确' : `推荐答案：${readingExpectedAnswer(question)}` }}
              </p>
              <p class="mt-1 text-gray-500 dark:text-gray-400">
                {{ question.explanation }}
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>

    <button v-if="!submitted" class="mt-8 w-full rounded-xl bg-primary-600 px-6 py-4 font-medium text-white" @click="submit">
      提交完整训练（已答 {{ answeredCount }} / 40）
    </button>
    <section v-else class="dark:bg-primary-950/30 mt-8 rounded-2xl bg-primary-50 p-7 text-center">
      <p class="text-sm text-gray-500">
        原始分
      </p>
      <p class="mt-2 text-5xl font-bold text-gray-950 dark:text-white">
        {{ score }} / 40
      </p>
      <p class="mt-3 text-lg text-gray-700 dark:text-gray-300">
        正确率 {{ accuracy }}%，错题已进入复习。
      </p>
      <p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
        本训练复现 60 分钟和 40 题的答题负荷，但文章为站内原创练习材料，不是 Cambridge 或 IELTS 官方真题，因此只显示原始分，不直接宣称官方 Band。
      </p>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <RouterLink to="/review" class="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
          查看错题
        </RouterLink>
        <RouterLink to="/roadmap" class="border border-primary-300 rounded-xl px-6 py-3 font-medium text-primary-700 dark:border-primary-800 dark:text-primary-300">
          返回学习路线
        </RouterLink>
      </div>
    </section>
  </div>
</template>
