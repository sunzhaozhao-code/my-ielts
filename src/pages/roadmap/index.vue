<script setup lang="ts">
import { useStudyStore } from '~/composables/useStudyStore'
import { STAGES, getStageIndex } from '~/data/stages'

const studyStore = useStudyStore()
const progress = studyStore.progress
const profile = studyStore.profile
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:py-10">
    <div class="mb-8">
      <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
        学习路线
      </p>
      <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        从现在到 IELTS {{ profile?.targetBand.toFixed(1) }}
      </h1>
      <p class="mt-3 text-gray-500 dark:text-gray-400">
        阶段进度由完成的课程 Day 推进，不会因为几天没有学习而自动跳过。
      </p>
    </div>

    <div class="space-y-4">
      <article v-for="(stage, index) in STAGES" :key="stage.id" class="border rounded-2xl bg-white p-5 dark:bg-gray-800 sm:p-6" :class="stage.id === progress.currentStage ? 'border-primary-400 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700'">
        <div class="flex items-start gap-4">
          <div class="h-10 w-10 flex shrink-0 items-center justify-center rounded-full font-bold" :class="index < getStageIndex(progress.currentStage) ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : stage.id === progress.currentStage ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'">
            <span v-if="index < getStageIndex(progress.currentStage)" class="i-carbon-checkmark" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h2 class="text-lg font-bold text-gray-950 dark:text-white">
                {{ stage.label }}
              </h2>
              <span v-if="!stage.available" class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-700">后续扩展</span>
              <span v-else-if="stage.id === progress.currentStage" class="dark:bg-primary-950 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300">当前阶段</span>
            </div>
            <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {{ stage.description }}
            </p>
            <StageProgress v-if="stage.id === progress.currentStage" class="mt-4" :label="stage.label" :progress="progress.stageProgress" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
