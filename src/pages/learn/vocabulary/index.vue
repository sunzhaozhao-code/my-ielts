<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { toLocalDateKey } from '~/domain/study/dayLifecycle'
import { createVocabularySession } from '~/domain/resources/vocabulary'
import type { VocabularyRating } from '~/types/study'

const route = useRoute()
const studyStore = useStudyStore()
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const task = studyStore.activePlan.value?.tasks.find(item => item.id === taskId)
const mode = route.query.mode === 'review' ? 'review' : 'new'
const targetCount = task?.targetCount ?? (mode === 'review' ? 10 : 15)
const queue = ref(createVocabularySession(
  studyStore.state.vocabularyProgress,
  mode,
  targetCount,
  toLocalDateKey(),
  studyStore.progress.value.courseDay,
))
const currentIndex = ref(0)
const revealed = ref(false)
const completed = ref(false)
const knownCount = ref(0)
const fuzzyCount = ref(0)
const unknownCount = ref(0)
const repeatedIds = new Set<number>()

const current = computed(() => queue.value[currentIndex.value])
const progressPercent = computed(() => queue.value.length ? Math.round(currentIndex.value / queue.value.length * 100) : 100)

let audio: HTMLAudioElement | null = null
function speakWithBrowser(word: string) {
  if (!('speechSynthesis' in window))
    return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-GB'
  window.speechSynthesis.speak(utterance)
}

function playWord() {
  if (!current.value)
    return
  audio?.pause()
  audio = new Audio(`${import.meta.env.BASE_URL}vocabulary/audio/${current.value.chapter}/${current.value.words[0]}.mp3`)
  let usedFallback = false
  const fallback = () => {
    if (usedFallback)
      return
    usedFallback = true
    speakWithBrowser(current.value?.words[0] ?? '')
  }
  audio.addEventListener('error', fallback, { once: true })
  audio.play().catch(fallback)
}

function completeEmptyReview() {
  completed.value = true
  studyStore.completeTaskWithResult(taskId, { accuracy: 100, reviewRequired: false })
}

function rate(rating: VocabularyRating) {
  const word = current.value
  if (!word)
    return

  const sameDayRepeat = repeatedIds.has(word.id)
  studyStore.recordVocabularyRating({
    wordId: word.id,
    chapter: word.chapter,
    word: word.words[0],
    rating,
    sameDayRepeat,
  })

  if (rating === 'known') {
    knownCount.value++
  }
  else if (rating === 'fuzzy') {
    fuzzyCount.value++
  }
  else {
    unknownCount.value++
    if (!sameDayRepeat) {
      repeatedIds.add(word.id)
      queue.value.push(word)
    }
  }

  currentIndex.value++
  revealed.value = false
  if (currentIndex.value >= queue.value.length) {
    completed.value = true
    const total = knownCount.value + fuzzyCount.value + unknownCount.value
    const accuracy = total ? Math.round(knownCount.value / total * 100) : 0
    studyStore.completeTaskWithResult(taskId, { accuracy, reviewRequired: fuzzyCount.value + unknownCount.value > 0 })
  }
  else {
    window.setTimeout(playWord, 150)
  }
}

onMounted(playWord)
onUnmounted(() => audio?.pause())
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>

    <section v-if="completed" class="dark:bg-primary-950/30 mt-6 border border-primary-200 rounded-3xl bg-primary-50 p-8 text-center dark:border-primary-900">
      <span class="i-carbon-checkmark-filled text-5xl text-primary-600" />
      <h1 class="mt-4 text-3xl font-bold text-gray-950 dark:text-white">
        词汇任务完成
      </h1>
      <div class="grid grid-cols-3 mx-auto mt-6 max-w-lg gap-3">
        <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
          <strong class="block text-2xl text-green-600">{{ knownCount }}</strong><span class="text-xs text-gray-500">认识</span>
        </div>
        <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
          <strong class="block text-2xl text-amber-600">{{ fuzzyCount }}</strong><span class="text-xs text-gray-500">模糊</span>
        </div>
        <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
          <strong class="block text-2xl text-red-600">{{ unknownCount }}</strong><span class="text-xs text-gray-500">不认识</span>
        </div>
      </div>
      <RouterLink to="/" class="mt-7 inline-block rounded-xl bg-primary-600 px-6 py-3 font-medium text-white">
        回到今日学习
      </RouterLink>
    </section>

    <template v-else-if="current">
      <div class="mt-7 flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
            {{ mode === 'review' ? '词汇复习' : '今日新词' }}
          </p>
          <h1 class="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
            {{ currentIndex + 1 }} / {{ queue.length }}
          </h1>
        </div>
        <span class="text-sm text-gray-500">{{ progressPercent }}%</span>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div class="h-full rounded-full bg-primary-600 transition-width" :style="{ width: `${progressPercent}%` }" />
      </div>

      <article class="mt-6 min-h-100 border border-gray-200 rounded-3xl bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-10">
        <div class="flex items-center justify-between gap-4">
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-700">{{ current.chapter.replace(/^\d+_/, '') }}</span>
          <button class="dark:bg-primary-950 h-10 w-10 flex items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:text-primary-300" @click="playWord">
            <span class="i-carbon-volume-up-filled" />
          </button>
        </div>
        <div class="py-12 text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl dark:text-white">
            {{ current.words.join(' / ') }}
          </h2>
          <p class="mt-3 text-gray-400">
            {{ current.pos }}
          </p>
        </div>

        <div v-if="revealed" class="border-t border-gray-100 pt-6 dark:border-gray-700">
          <p class="text-xl font-semibold text-gray-950 dark:text-white">
            {{ current.meaning }}
          </p>
          <p v-if="current.example" class="mt-4 leading-7 text-gray-600 dark:text-gray-300">
            {{ current.example }}
          </p>
          <p v-if="current.extra && current.extra !== '-'" class="mt-2 text-sm text-primary-700 dark:text-primary-400">
            {{ current.extra }}
          </p>
        </div>
        <button v-else class="w-full border border-gray-300 rounded-xl py-3 font-medium dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" @click="revealed = true">
          查看释义
        </button>
      </article>

      <div v-if="revealed" class="grid grid-cols-3 mt-5 gap-3">
        <button class="rounded-xl bg-green-600 px-3 py-3 font-medium text-white hover:bg-green-700" @click="rate('known')">
          认识
        </button>
        <button class="rounded-xl bg-amber-500 px-3 py-3 font-medium text-white hover:bg-amber-600" @click="rate('fuzzy')">
          模糊
        </button>
        <button class="rounded-xl bg-red-600 px-3 py-3 font-medium text-white hover:bg-red-700" @click="rate('unknown')">
          不认识
        </button>
      </div>
    </template>

    <section v-else class="mt-6 border border-gray-200 rounded-3xl bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
      <span class="i-carbon-checkmark-outline text-5xl text-green-600" />
      <h1 class="mt-4 text-2xl font-bold text-gray-950 dark:text-white">
        今天没有到期单词
      </h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        复习队列不会再用未学习的新词凑数。
      </p>
      <button class="mt-6 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white" @click="completeEmptyReview">
        完成本次复习
      </button>
    </section>
  </div>
</template>
