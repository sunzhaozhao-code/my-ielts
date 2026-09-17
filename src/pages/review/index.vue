<script setup lang="ts">
import { computed } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { toLocalDateKey } from '~/domain/study/dayLifecycle'

const studyStore = useStudyStore()
const today = toLocalDateKey()
const reviewWords = computed(() => Object.values(studyStore.state.vocabularyProgress)
  .filter(word => word.status !== 'mastered')
  .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate)))
const dueWords = computed(() => reviewWords.value.filter(word => word.nextReviewDate <= today))
const errorRecords = computed(() => [...studyStore.state.errorRecords]
  .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate)))
const dueErrors = computed(() => errorRecords.value.filter(record => record.nextReviewDate <= today))
const counts = computed(() => ({
  grammar: errorRecords.value.filter(record => record.type === 'grammar').length,
  listening: errorRecords.value.filter(record => record.type === 'listening').length,
  reading: errorRecords.value.filter(record => record.type === 'reading').length,
}))
const activeReviewTask = computed(() => studyStore.activePlan.value?.tasks.find(task => task.route.startsWith('/review') && task.status !== 'completed'))
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
      复习
    </p>
    <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
      复习队列
    </h1>
    <p class="mt-3 text-gray-500 dark:text-gray-400">
      今天到期的内容排在最前面；尚未到期的错题也会保留在这里，避免遗忘。
    </p>

    <div class="grid grid-cols-2 mt-8 gap-3 sm:grid-cols-4">
      <div v-for="item in [{ label: '待复习单词', value: reviewWords.length }, { label: '语法错题', value: counts.grammar }, { label: '听力错题', value: counts.listening }, { label: '阅读错题', value: counts.reading }]" :key="item.label" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-sm text-gray-500">
          {{ item.label }}
        </p><p class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          {{ item.value }}
        </p>
      </div>
    </div>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-950 dark:text-white">
            待复习单词
          </h2><p class="mt-1 text-sm text-gray-500">
            不认识的词当天再出现，模糊的词次日复习。
          </p>
        </div><RouterLink v-if="dueWords.length" to="/learn/vocabulary?mode=review" class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white">
          开始复习
        </RouterLink>
      </div>
      <div v-if="dueWords.length" class="mt-5 flex flex-wrap gap-2">
        <span v-for="word in dueWords.slice(0, 24)" :key="word.resourceId" class="rounded-full bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-700">{{ word.word }}</span><span v-if="dueWords.length > 24" class="px-3 py-1.5 text-sm text-gray-400">还有 {{ dueWords.length - 24 }} 个</span>
      </div>
      <p v-else class="mt-5 rounded-xl bg-gray-50 p-5 text-sm text-gray-500 dark:bg-gray-900">
        {{ reviewWords.length ? `今天没有到期单词，队列中还有 ${reviewWords.length} 个单词。` : '还没有待复习单词。' }}
      </p>
    </section>

    <section class="mt-5 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-bold text-gray-950 dark:text-white">
        错题记录
      </h2>
      <div v-if="errorRecords.length" class="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
        <div v-for="record in errorRecords" :key="record.id" class="flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <span class="mr-2 rounded-full bg-red-50 px-2.5 py-1 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">{{ record.type === 'grammar' ? '语法' : record.type === 'listening' ? '听力' : '阅读' }}</span><span class="font-medium text-gray-900 dark:text-white">{{ record.title }}</span><p class="mt-1 text-xs text-gray-500">
              累计错误 {{ record.wrongCount }} 次 · {{ record.nextReviewDate <= today ? '今天到期' : `${record.nextReviewDate} 复习` }}
            </p>
          </div>
          <RouterLink :to="record.route" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
            {{ record.nextReviewDate <= today ? '开始复习' : '提前练习' }} →
          </RouterLink>
        </div>
      </div>
      <p v-else class="mt-4 rounded-xl bg-gray-50 p-5 text-sm text-gray-500 dark:bg-gray-900">
        还没有错题记录。
      </p>
    </section>

    <button v-if="activeReviewTask" class="mt-5 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700" :disabled="dueWords.length > 0 || dueErrors.length > 0" @click="studyStore.completeTaskWithResult(activeReviewTask.id)">
      {{ dueWords.length || dueErrors.length ? `还有 ${dueWords.length + dueErrors.length} 项到期内容待复习` : '完成本次复习任务' }}
    </button>
  </div>
</template>
