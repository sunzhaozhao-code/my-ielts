<script setup lang="ts">
import type { DailyPlan } from '~/types/study'

defineProps<{
  plan: DailyPlan
}>()

function wordCountByType(plan: DailyPlan, type: 'vocabulary-new' | 'vocabulary-review') {
  return plan.tasks.filter(task => task.type === type).reduce((sum, task) => sum + (task.targetCount ?? 0), 0)
}
</script>

<template>
  <section class="dark:bg-primary-950/30 border border-primary-200 rounded-3xl bg-primary-50 p-6 text-center dark:border-primary-900 sm:p-10">
    <div class="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-primary-600 text-2xl text-white">
      <span class="i-carbon-checkmark-filled" />
    </div>
    <h1 class="mt-5 text-3xl font-bold text-gray-950 dark:text-white">
      Day {{ plan.dayNumber }} 完成
    </h1>
    <p class="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-300">
      今天的任务已经收好。下次打开时，系统会从 Day {{ plan.dayNumber + 1 }} 继续。
    </p>

    <div class="grid grid-cols-2 mx-auto mt-8 max-w-2xl gap-3 sm:grid-cols-4">
      <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
        <div class="text-2xl font-bold text-gray-950 dark:text-white">
          {{ plan.estimatedMinutes }}
        </div>
        <div class="mt-1 text-xs text-gray-500">
          预计分钟
        </div>
      </div>
      <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
        <div class="text-2xl font-bold text-gray-950 dark:text-white">
          {{ plan.tasks.length }}
        </div>
        <div class="mt-1 text-xs text-gray-500">
          完成任务
        </div>
      </div>
      <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
        <div class="text-2xl font-bold text-gray-950 dark:text-white">
          {{ wordCountByType(plan, 'vocabulary-new') }}
        </div>
        <div class="mt-1 text-xs text-gray-500">
          新学单词
        </div>
      </div>
      <div class="rounded-xl bg-white p-4 dark:bg-gray-800">
        <div class="text-2xl font-bold text-gray-950 dark:text-white">
          {{ wordCountByType(plan, 'vocabulary-review') }}
        </div>
        <div class="mt-1 text-xs text-gray-500">
          复习单词
        </div>
      </div>
    </div>
  </section>
</template>
