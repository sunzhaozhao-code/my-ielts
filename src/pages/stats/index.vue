<script setup lang="ts">
import { computed } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { STAGES, getStage, getStageIndex } from '~/data/stages'
import { toLocalDateKey } from '~/domain/study/dayLifecycle'

const studyStore = useStudyStore()
const progress = studyStore.progress
const today = toLocalDateKey()
const vocabulary = computed(() => Object.values(studyStore.state.vocabularyProgress))
const dueWords = computed(() => vocabulary.value.filter(word => word.nextReviewDate <= today && word.status !== 'mastered').length)
const attemptCount = (type: 'listening' | 'reading' | 'writing') => studyStore.state.skillAttempts.filter(attempt => attempt.type === type).length
const completedWriting = computed(() => Object.values(studyStore.state.writingDrafts).filter(draft => draft.completedAt).length)
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
      学习数据
    </p>
    <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
      你的学习记录
    </h1>

    <div class="grid grid-cols-2 mt-8 gap-4 lg:grid-cols-4">
      <div
        v-for="item in [
          { label: '累计学习天数', value: progress.completedStudyDays, unit: '天' },
          { label: '连续学习天数', value: progress.streakDays, unit: '天' },
          { label: '累计学习时间', value: progress.totalMinutes, unit: '分钟' },
          { label: '完成任务', value: progress.totalCompletedTasks, unit: '项' },
          { label: '学习过的单词', value: vocabulary.length, unit: '个' },
          { label: '待复习单词', value: dueWords, unit: '个' },
          { label: '听力 / 阅读', value: `${attemptCount('listening')} / ${attemptCount('reading')}`, unit: '次' },
          { label: '完成写作', value: completedWriting, unit: '篇' },
        ]" :key="item.label" class="border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
      >
        <p class="text-sm text-gray-500">
          {{ item.label }}
        </p><p class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          {{ item.value }}<span class="ml-1 text-sm font-normal text-gray-500">{{ item.unit }}</span>
        </p>
      </div>
    </div>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-5 text-lg font-bold text-gray-950 dark:text-white">
        阶段进度
      </h2>
      <div class="space-y-5">
        <div v-for="stage in STAGES.filter(item => item.available)" :key="stage.id">
          <StageProgress :label="stage.label" :progress="getStageIndex(stage.id) < getStageIndex(progress.currentStage) ? 100 : stage.id === progress.currentStage ? progress.stageProgress : 0" />
          <p v-if="stage.id !== progress.currentStage" class="mt-1 text-xs text-gray-400">
            {{ getStageIndex(stage.id) < getStageIndex(progress.currentStage) ? '已完成' : '未开始' }}
          </p>
        </div>
      </div>
      <p class="mt-6 text-sm text-gray-500">
        当前：{{ getStage(progress.currentStage).label }} · Day {{ progress.courseDay }}
      </p>
    </section>
  </div>
</template>
