<script setup lang="ts">
import type { DailyTask } from '~/types/study'

const props = defineProps<{
  task: DailyTask
  disabled?: boolean
}>()

const emit = defineEmits<{
  toggle: [taskId: string, completed: boolean]
}>()

const iconMap: Record<DailyTask['type'], string> = {
  'vocabulary-new': 'i-carbon-book',
  'vocabulary-review': 'i-carbon-renew',
  'grammar': 'i-carbon-load-balancer-vpc',
  'listening': 'i-carbon-headphones',
  'reading': 'i-carbon-document',
  'writing': 'i-carbon-edit',
}

const completed = computed(() => props.task.status === 'completed')
</script>

<template>
  <article
    class="group flex gap-4 border rounded-2xl bg-white p-4 transition dark:border-gray-700 dark:bg-gray-800 sm:p-5"
    :class="completed ? 'border-primary-200 opacity-75 dark:border-primary-900' : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'"
  >
    <button
      type="button"
      class="mt-0.5 h-6 w-6 flex shrink-0 items-center justify-center border rounded-full transition"
      :class="completed ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 text-transparent hover:border-primary-500 dark:border-gray-600'"
      :disabled="disabled"
      :aria-label="completed ? '标记为未完成' : '标记为已完成'"
      @click="emit('toggle', task.id, !completed)"
    >
      <span class="i-carbon-checkmark" />
    </button>

    <div class="min-w-0 flex-1">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div class="flex items-center gap-2">
            <span class="dark:bg-primary-950 h-8 w-8 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:text-primary-300">
              <span :class="iconMap[task.type]" />
            </span>
            <h3 class="font-semibold text-gray-900 dark:text-white" :class="completed ? 'line-through' : ''">
              {{ task.title }}
            </h3>
          </div>
          <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {{ task.description }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <span class="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            约 {{ task.estimatedMinutes }} 分钟
          </span>
          <RouterLink
            v-if="!completed"
            :to="task.route"
            class="whitespace-nowrap text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline"
          >
            开始任务 →
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>
