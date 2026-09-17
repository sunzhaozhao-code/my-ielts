<script setup lang="ts">
defineProps<{
  dayNumber: number
  remainingTasks: number
}>()

const emit = defineEmits<{
  continue: []
  skip: []
}>()
</script>

<template>
  <div class="mb-6 border border-amber-200 rounded-2xl bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
    <div class="flex gap-3">
      <span class="i-carbon-time mt-1 shrink-0 text-xl text-amber-600 dark:text-amber-400" />
      <div class="flex-1">
        <h2 class="font-semibold text-amber-950 dark:text-amber-100">
          Day {{ dayNumber }} 还有 {{ remainingTasks }} 项未完成
        </h2>
        <p class="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-200">
          课程进度不会因为中断自动跳过。你可以继续，也可以从今天开始下一天。
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700" @click="emit('continue')">
            继续完成
          </button>
          <button class="border border-amber-300 rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-transparent hover:bg-amber-100 dark:text-amber-200" @click="emit('skip')">
            跳过并进入今天
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
