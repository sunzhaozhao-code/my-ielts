<script setup lang="ts">
import { useStudyStore } from '~/composables/useStudyStore'
import { STAGES, getStageIndex } from '~/data/stages'
import { evaluateStageReadiness } from '~/domain/study/stageReadiness'

const studyStore = useStudyStore()
const progress = studyStore.progress
const profile = studyStore.profile
const readiness = computed(() => evaluateStageReadiness(studyStore.state))
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

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-bold text-gray-950 dark:text-white">
        当前阶段能力门槛
      </h2>
      <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
        完成课程天数后，还需要满足下面的训练条件才会进入下一阶段，避免只靠打卡升级。
      </p>
      <div class="grid mt-5 gap-3 sm:grid-cols-2">
        <div v-for="item in readiness.requirements" :key="item.id" class="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-900">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
          <span class="text-sm font-semibold" :class="item.met ? 'text-green-600' : 'text-amber-600'">
            {{ item.current }} / {{ item.target }}{{ item.unit }}
          </span>
        </div>
      </div>
      <p class="mt-4 text-sm font-medium" :class="readiness.ready ? 'text-green-600' : 'text-amber-600'">
        {{ readiness.ready ? '能力条件已满足，完成阶段课程后可以晋级。' : '尚有条件未满足，系统会继续安排薄弱项训练。' }}
      </p>
      <RouterLink to="/assessment/reading" class="mt-5 inline-flex items-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white">
        开始阶段阅读测评
      </RouterLink>
    </section>
  </div>
</template>
