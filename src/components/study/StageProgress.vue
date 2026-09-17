<script setup lang="ts">
defineProps<{
  label: string
  progress: number
}>()
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between text-sm">
      <span class="font-medium text-gray-700 dark:text-gray-200">{{ label }}</span>
      <span class="text-gray-500 dark:text-gray-400">{{ Math.round(progress) }}%</span>
    </div>
    <div class="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
      <div
        class="h-full rounded-full bg-primary-600 transition-width duration-500 dark:bg-primary-500"
        :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
      />
    </div>
  </div>
</template>
