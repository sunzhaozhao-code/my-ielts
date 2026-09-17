<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { getStage } from '~/data/stages'
import { dayDistance, toLocalDateKey } from '~/domain/study/dayLifecycle'

defineOptions({ name: 'TodayPage' })

const studyStore = useStudyStore()
studyStore.ensureActivePlan()

const profile = studyStore.profile
const progress = studyStore.progress
const activePlan = studyStore.activePlan
const today = toLocalDateKey()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11)
    return '早上好'
  if (hour < 14)
    return '中午好'
  if (hour < 18)
    return '下午好'
  return '晚上好'
})

const completedCount = computed(() => activePlan.value?.tasks.filter(task => task.status === 'completed').length ?? 0)
const remainingCount = computed(() => (activePlan.value?.tasks.length ?? 0) - completedCount.value)
const allCompleted = computed(() => Boolean(activePlan.value?.tasks.length) && remainingCount.value === 0)
const isOverdue = computed(() => Boolean(
  activePlan.value
  && activePlan.value.status === 'active'
  && dayDistance(activePlan.value.assignedDate, today) > 0,
))
const carryoverChoiceMade = ref(false)
const showIncompletePrompt = computed(() => isOverdue.value && !carryoverChoiceMade.value)

function finishDay() {
  studyStore.finalizeActiveDay()
}

function skipOldDay() {
  studyStore.skipActiveDay(today)
}

function continueOldDay() {
  carryoverChoiceMade.value = true
  studyStore.continueActiveDay()
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <StudySummary v-if="activePlan?.status === 'completed'" :plan="activePlan" />

    <template v-else-if="activePlan && profile">
      <IncompleteDayPrompt
        v-if="showIncompletePrompt"
        :day-number="activePlan.dayNumber"
        :remaining-tasks="remainingCount"
        @continue="continueOldDay"
        @skip="skipOldDay"
      />

      <header class="mb-8">
        <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p class="text-gray-500 dark:text-gray-400">
              {{ greeting }}
            </p>
            <h1 class="mt-1 text-3xl font-bold text-gray-950 sm:text-4xl dark:text-white">
              今天只做这几件事。
            </h1>
          </div>
          <div class="flex flex-wrap gap-2 text-sm">
            <span class="dark:bg-primary-950 rounded-full bg-primary-50 px-3 py-1.5 text-primary-800 dark:text-primary-200">目标 IELTS {{ profile.targetBand.toFixed(1) }}</span>
            <span class="rounded-full bg-gray-100 px-3 py-1.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{{ getStage(progress.currentStage).label }}</span>
          </div>
        </div>
      </header>

      <section class="grid mb-6 gap-4 sm:grid-cols-3">
        <div class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-sm text-gray-500">
            课程进度
          </p>
          <p class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            Day {{ activePlan.dayNumber }}
          </p>
        </div>
        <div class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-sm text-gray-500">
            今日预计
          </p>
          <p class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            {{ activePlan.estimatedMinutes }}<span class="ml-1 text-base font-normal text-gray-500">分钟</span>
          </p>
        </div>
        <div class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-sm text-gray-500">
            连续学习
          </p>
          <p class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            {{ progress.streakDays }}<span class="ml-1 text-base font-normal text-gray-500">天</span>
          </p>
        </div>
      </section>

      <section class="border border-gray-200 rounded-3xl bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40 sm:p-6">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-950 dark:text-white">
              今日任务
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ completedCount }} / {{ activePlan.tasks.length }} 已完成
            </p>
          </div>
          <div class="h-12 w-12 flex items-center justify-center rounded-full bg-white text-sm font-bold text-primary-700 shadow-sm dark:bg-gray-800 dark:text-primary-300">
            {{ Math.round(completedCount / activePlan.tasks.length * 100) }}%
          </div>
        </div>

        <div class="space-y-3">
          <DailyTaskCard v-for="task in activePlan.tasks" :key="task.id" :task="task" />
        </div>

        <button class="mt-6 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 hover:bg-primary-700 dark:disabled:bg-gray-700" :disabled="!allCompleted" @click="finishDay">
          {{ allCompleted ? `完成今日学习 · Day ${activePlan.dayNumber}` : `还有 ${remainingCount} 项未完成` }}
        </button>
      </section>

      <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <StageProgress :label="getStage(progress.currentStage).label" :progress="progress.stageProgress" />
      </section>
    </template>
  </div>
</template>
