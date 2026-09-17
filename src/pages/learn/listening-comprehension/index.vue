<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { getListeningLesson, selectListeningLesson } from '~/data/listeningLessons'

const route = useRoute()
const studyStore = useStudyStore()
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const requestedLesson = typeof route.query.lesson === 'string' ? route.query.lesson : undefined
const lesson = getListeningLesson(requestedLesson)
  ?? selectListeningLesson(studyStore.progress.value.currentStage, studyStore.state.skillAttempts, studyStore.progress.value.courseDay)

const answers = ref<Array<number | null>>(lesson.questions.map(() => null))
const submitted = ref(false)
const transcriptVisible = ref(false)
const playing = ref(false)
const playCount = ref(0)
const audioError = ref('')
const startedAt = Date.now()
const answered = computed(() => answers.value.filter(answer => answer !== null).length)
const score = computed(() => lesson.questions.filter((question, index) => answers.value[index] === question.answer).length)

function getEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  return voices.find(voice => /^en-GB/i.test(voice.lang))
    ?? voices.find(voice => /^en/i.test(voice.lang))
}

function play() {
  audioError.value = ''
  if (!('speechSynthesis' in window)) {
    audioError.value = '当前浏览器不支持语音朗读，请展开文本完成训练。'
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(lesson.transcript)
  utterance.lang = 'en-GB'
  utterance.rate = 0.92
  utterance.voice = getEnglishVoice() ?? null
  utterance.onstart = () => {
    playing.value = true
    playCount.value++
  }
  utterance.onend = () => playing.value = false
  utterance.onerror = () => {
    playing.value = false
    audioError.value = '语音播放失败，请重试或展开文本完成训练。'
  }
  window.speechSynthesis.speak(utterance)
}

function stop() {
  window.speechSynthesis?.cancel()
  playing.value = false
}

function submit() {
  if (answered.value !== lesson.questions.length)
    return
  submitted.value = true
  stop()
  lesson.questions.forEach((question, index) => studyStore.recordQuestionResult({
    resourceId: `listening:lesson:${lesson.id}`,
    type: 'listening',
    questionId: question.id,
    title: lesson.title,
    route: `/learn/listening-comprehension?lesson=${encodeURIComponent(lesson.id)}`,
    correct: answers.value[index] === question.answer,
  }))
  const accuracy = Math.round(score.value / lesson.questions.length * 100)
  studyStore.addSkillAttempt({
    type: 'listening',
    resourceId: `listening:lesson:${lesson.id}`,
    durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    accuracy,
    score: score.value,
    replayCount: Math.max(0, playCount.value - 1),
  })
  studyStore.completeTaskWithResult(taskId, { score: score.value, accuracy, reviewRequired: accuracy < 80 })
  transcriptVisible.value = true
}

onMounted(() => window.setTimeout(play, 250))
onUnmounted(stop)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>

    <header class="mt-6">
      <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
        听力理解 · 难度 {{ lesson.difficulty }}
      </p>
      <h1 class="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
        {{ lesson.title }}
      </h1>
      <p class="mt-3 text-gray-500 dark:text-gray-400">
        {{ lesson.context }}
      </p>
    </header>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <ol class="grid gap-2 text-sm text-gray-500 sm:grid-cols-3">
        <li class="rounded-lg bg-primary-50 px-3 py-2 text-primary-800 dark:bg-primary-950 dark:text-primary-200">1. 不看文本盲听</li>
        <li class="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">2. 完成理解题</li>
        <li class="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">3. 查看文本并重听</li>
      </ol>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button class="rounded-xl bg-primary-600 px-5 py-3 font-medium text-white" @click="playing ? stop() : play()">
          {{ playing ? '停止播放' : playCount ? '再听一遍' : '播放听力' }}
        </button>
        <span class="text-sm text-gray-500">已播放 {{ playCount }} 次</span>
      </div>
      <p v-if="audioError" class="mt-3 text-sm text-red-600 dark:text-red-400">
        {{ audioError }}
      </p>
      <button class="mt-5 text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline" @click="transcriptVisible = !transcriptVisible">
        {{ transcriptVisible ? '收起听力文本' : '听完后查看文本' }}
      </button>
      <p v-if="transcriptVisible" class="mt-3 rounded-xl bg-gray-50 p-4 leading-7 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
        {{ lesson.transcript }}
      </p>
    </section>

    <section class="mt-6 space-y-4">
      <article v-for="(question, questionIndex) in lesson.questions" :key="question.id" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="font-semibold text-gray-950 dark:text-white">
          {{ questionIndex + 1 }}. {{ question.prompt }}
        </h2>
        <div class="grid mt-4 gap-2 sm:grid-cols-2">
          <button
            v-for="(option, optionIndex) in question.options" :key="option" class="border rounded-lg px-4 py-3 text-left text-sm" :disabled="submitted" :class="[
              answers[questionIndex] === optionIndex ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700',
              submitted && optionIndex === question.answer ? '!border-green-600 !bg-green-50 dark:!bg-green-950/30' : '',
              submitted && answers[questionIndex] === optionIndex && optionIndex !== question.answer ? '!border-red-500 !bg-red-50 dark:!bg-red-950/30' : '',
            ]" @click="answers[questionIndex] = optionIndex"
          >
            {{ option }}
          </button>
        </div>
        <p v-if="submitted" class="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {{ question.explanation }}
        </p>
      </article>
    </section>

    <button v-if="!submitted" class="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white disabled:opacity-40" :disabled="answered !== lesson.questions.length" @click="submit">
      {{ answered === lesson.questions.length ? '提交听力结果' : `还需完成 ${lesson.questions.length - answered} 题` }}
    </button>
    <div v-else class="mt-6 rounded-2xl bg-primary-50 p-6 text-center dark:bg-primary-950/30">
      <p class="text-3xl font-bold text-gray-950 dark:text-white">
        正确率 {{ Math.round(score / lesson.questions.length * 100) }}%
      </p>
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        错题已进入复习。请结合上方文本再听一遍。
      </p>
      <RouterLink to="/" class="mt-4 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
        回到今日学习
      </RouterLink>
    </div>
  </div>
</template>
