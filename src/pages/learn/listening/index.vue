<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import words from '~/pages/listening/listening179.json'

const route = useRoute()
const studyStore = useStudyStore()
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const task = studyStore.activePlan.value?.tasks.find(item => item.id === taskId)
const requestedWord = typeof route.query.word === 'string' ? route.query.word : undefined
const reviewWord = requestedWord ? words.find(item => item.word === requestedWord) : undefined
const targetCount = reviewWord ? 1 : task?.targetCount ?? 10
const start = ((studyStore.progress.value.courseDay - 1) * targetCount) % words.length
const session = reviewWord ? [reviewWord] : [...words.slice(start), ...words.slice(0, start)].slice(0, targetCount)
const currentIndex = ref(0)
const answer = ref('')
const checked = ref(false)
const correctCount = ref(0)
const replayCount = ref(0)
const completed = ref(false)
const startedAt = Date.now()
const current = computed(() => session[currentIndex.value])
const isCorrect = computed(() => answer.value.trim().toLowerCase() === current.value?.word.toLowerCase())

let audio: HTMLAudioElement | null = null
function playAudio() {
  if (!current.value)
    return
  audio?.pause()
  audio = new Audio(`${import.meta.env.BASE_URL}179_audios/${current.value.word}.mp3`)
  audio.play()
  replayCount.value++
}

function checkAnswer() {
  if (!answer.value.trim())
    return
  checked.value = true
  if (isCorrect.value)
    correctCount.value++
  studyStore.recordQuestionResult({
    resourceId: 'listening:179',
    type: 'listening',
    questionId: String(current.value.index),
    title: `听力考点词：${current.value.word}`,
    route: `/learn/listening?word=${encodeURIComponent(current.value.word)}`,
    correct: isCorrect.value,
  })
}

function next() {
  if (currentIndex.value === session.length - 1) {
    completed.value = true
    const accuracy = Math.round(correctCount.value / session.length * 100)
    studyStore.addSkillAttempt({
      type: 'listening',
      resourceId: 'listening:179',
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      accuracy,
      score: correctCount.value,
      replayCount: replayCount.value,
    })
    studyStore.completeTaskWithResult(taskId, { score: correctCount.value, accuracy, reviewRequired: accuracy < 80 })
    return
  }
  currentIndex.value++
  answer.value = ''
  checked.value = false
  window.setTimeout(playAudio, 150)
}

onMounted(playAudio)
onUnmounted(() => audio?.pause())
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>

    <section v-if="completed" class="dark:bg-primary-950/30 mt-6 rounded-3xl bg-primary-50 p-8 text-center">
      <span class="i-carbon-headphones text-5xl text-primary-600" />
      <h1 class="mt-4 text-3xl font-bold text-gray-950 dark:text-white">
        听力训练完成
      </h1>
      <p class="mt-3 text-xl text-gray-600 dark:text-gray-300">
        正确 {{ correctCount }} / {{ session.length }} · 重听 {{ replayCount }} 次
      </p>
      <RouterLink to="/" class="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
        回到今日学习
      </RouterLink>
    </section>

    <template v-else>
      <header class="mt-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
            听力短训练
          </p><h1 class="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
            第 {{ currentIndex + 1 }} / {{ session.length }} 题
          </h1>
        </div>
        <span class="text-sm text-gray-500">已重听 {{ replayCount }} 次</span>
      </header>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div class="h-full bg-primary-600 transition-width" :style="{ width: `${currentIndex / session.length * 100}%` }" />
      </div>

      <section class="mt-6 border border-gray-200 rounded-3xl bg-white p-7 dark:border-gray-700 dark:bg-gray-800 sm:p-10">
        <ol class="grid mb-8 gap-2 text-sm text-gray-500 sm:grid-cols-3">
          <li class="dark:bg-primary-950 rounded-lg bg-primary-50 px-3 py-2 text-primary-800 dark:text-primary-200">
            1. 先盲听
          </li>
          <li class="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">
            2. 输入听到的词
          </li>
          <li class="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900">
            3. 看文本再听
          </li>
        </ol>

        <button aria-label="播放听力音频" class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-primary-600 text-4xl text-white shadow-lg hover:bg-primary-700" @click="playAudio">
          <span class="i-carbon-play-filled-alt" />
        </button>
        <p class="mt-3 text-center text-sm text-gray-500">
          点击播放音频
        </p>

        <div class="mx-auto mt-8 max-w-lg">
          <input v-model="answer" class="w-full border border-gray-300 rounded-xl bg-transparent px-4 py-3 text-center text-lg outline-none dark:border-gray-600 focus:border-primary-500" placeholder="输入听到的单词或短语" :disabled="checked" @keydown.enter="checked ? next() : checkAnswer()">
          <button v-if="!checked" class="mt-3 w-full rounded-xl bg-primary-600 py-3 font-medium text-white disabled:opacity-40" :disabled="!answer.trim()" @click="checkAnswer">
            检查答案
          </button>
        </div>

        <div v-if="checked" class="mt-6 border-t border-gray-100 pt-6 text-center dark:border-gray-700">
          <p class="text-sm font-semibold" :class="isCorrect ? 'text-green-600' : 'text-red-600'">
            {{ isCorrect ? '回答正确' : `正确答案：${current.word}` }}
          </p>
          <p class="mt-2 text-xl font-bold text-gray-950 dark:text-white">
            {{ current.word }} <span class="text-sm font-normal text-gray-400">{{ current.type }}</span>
          </p>
          <p class="mt-1 text-gray-600 dark:text-gray-300">
            {{ current.meaning }}
          </p>
          <p class="mt-2 text-sm text-primary-700 dark:text-primary-400">
            同义替换：{{ current.replace.join('、') }}
          </p>
          <div class="mt-5 flex justify-center gap-3">
            <button class="border border-gray-300 rounded-xl px-5 py-2.5 text-sm font-medium dark:border-gray-600" @click="playAudio">
              再听一遍
            </button><button class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white" @click="next">
              {{ currentIndex === session.length - 1 ? '完成训练' : '下一题' }}
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
