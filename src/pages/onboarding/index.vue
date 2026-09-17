<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { getStage } from '~/data/stages'
import { estimateStudyDays } from '~/domain/study/placement'
import type { DailyMinutes, ExamType, TargetBand, UserProfile } from '~/types/study'

defineOptions({ name: 'OnboardingPage' })

const router = useRouter()
const route = useRoute()
const studyStore = useStudyStore()
const step = ref(1)
const examType = ref<ExamType>(studyStore.profile.value?.examType ?? 'academic')
const targetBand = ref<TargetBand>(studyStore.profile.value?.targetBand ?? 6.5)
const dailyMinutes = ref<DailyMinutes>(studyStore.profile.value?.dailyMinutes ?? 60)
const estimate = computed(() => estimateStudyDays(targetBand.value, dailyMinutes.value))

function createPlan() {
  const now = new Date().toISOString()
  const profile: UserProfile = {
    targetBand: targetBand.value,
    dailyMinutes: dailyMinutes.value,
    examType: examType.value,
    createdAt: studyStore.profile.value?.createdAt ?? now,
    updatedAt: now,
  }
  if (route.query.restart === '1')
    studyStore.reconfigureLearningPlan(profile)
  else
    studyStore.completeOnboarding(profile)
  router.push('/')
}
</script>

<template>
  <main class="min-h-[calc(100vh-2rem)] flex items-center justify-center px-4 py-8">
    <div class="max-w-3xl w-full">
      <div v-if="step > 1" class="mb-6 flex items-center gap-2 px-1">
        <div v-for="item in 5" :key="item" class="h-1.5 flex-1 rounded-full" :class="item <= step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'" />
      </div>

      <section class="border border-gray-200 rounded-3xl bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-10">
        <template v-if="step === 1">
          <div class="mx-auto max-w-xl py-8 text-center">
            <div class="dark:bg-primary-950 mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary-100 text-3xl text-primary-700 dark:text-primary-300">
              <span class="i-carbon-calendar" />
            </div>
            <p class="mt-8 text-sm font-semibold tracking-wider uppercase text-primary-700 dark:text-primary-400">
              My IELTS 完整学习路线
            </p>
            <h1 class="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl dark:text-white">
              每天打开，只学今天该学的内容。
            </h1>
            <p class="mt-5 leading-7 text-gray-500 dark:text-gray-400">
              不再通过短测试跳级。所有人都从基础恢复开始，词汇、语法、听力、阅读和写作会按由浅到深的顺序自动安排。
            </p>
            <button class="mt-8 rounded-xl bg-primary-600 px-7 py-3 font-medium text-white hover:bg-primary-700" @click="step = 2">
              设置学习计划
            </button>
            <p class="mt-5 text-sm text-gray-500">
              已经有学习账号？<RouterLink to="/account" class="font-medium text-primary-700 dark:text-primary-400 hover:underline">
                登录并同步进度
              </RouterLink>
            </p>
          </div>
        </template>

        <template v-else-if="step === 2">
          <p class="text-sm font-medium text-primary-700 dark:text-primary-400">
            第 1 步
          </p>
          <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            选择考试类型
          </h1>
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            两条路线共享基础内容，写作题会根据考试类型自动安排。
          </p>
          <div class="grid mt-8 gap-4 sm:grid-cols-2">
            <button class="border rounded-2xl p-6 text-left transition" :class="examType === 'academic' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'" @click="examType = 'academic'">
              <span class="text-xl font-bold text-gray-950 dark:text-white">Academic 学术类</span>
              <span class="mt-2 block text-sm leading-6 text-gray-500">适合申请大学、研究生及专业注册。</span>
            </button>
            <button class="border rounded-2xl p-6 text-left transition" :class="examType === 'general' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'" @click="examType = 'general'">
              <span class="text-xl font-bold text-gray-950 dark:text-white">General 培训类</span>
              <span class="mt-2 block text-sm leading-6 text-gray-500">适合移民、工作和非学位培训用途。</span>
            </button>
          </div>
          <div class="mt-8 flex justify-end">
            <button class="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700" @click="step = 3">
              下一步
            </button>
          </div>
        </template>

        <template v-else-if="step === 3">
          <p class="text-sm font-medium text-primary-700 dark:text-primary-400">
            第 2 步
          </p>
          <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            你的目标分数
          </h1>
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            目标分数用于标记学习里程碑，不会截断课程。所有人都会从基础恢复开始，并依次学习到现有路线末尾。
          </p>
          <div class="grid mt-8 gap-4 sm:grid-cols-3">
            <button v-for="band in ([6, 6.5, 7] as TargetBand[])" :key="band" class="border rounded-2xl p-6 text-center transition" :class="targetBand === band ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'" @click="targetBand = band">
              <span class="text-3xl font-bold text-gray-950 dark:text-white">{{ band.toFixed(1) }}</span>
              <span class="mt-1 block text-sm text-gray-500">IELTS</span>
            </button>
          </div>
          <div class="mt-8 flex justify-end">
            <button class="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700" @click="step = 4">
              下一步
            </button>
          </div>
        </template>

        <template v-else-if="step === 4">
          <p class="text-sm font-medium text-primary-700 dark:text-primary-400">
            第 3 步
          </p>
          <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            每天能学习多久？
          </h1>
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            学习顺序保持不变，每日时间只影响完成整条路线所需的学习日数。默认推荐 60 分钟。
          </p>
          <div class="grid grid-cols-2 mt-8 gap-4 sm:grid-cols-4">
            <button v-for="minutes in ([30, 45, 60, 90] as DailyMinutes[])" :key="minutes" class="border rounded-2xl p-5 text-center transition" :class="dailyMinutes === minutes ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'" @click="dailyMinutes = minutes">
              <span class="text-2xl font-bold text-gray-950 dark:text-white">{{ minutes }}</span>
              <span class="mt-1 block text-sm text-gray-500">分钟</span>
            </button>
          </div>
          <div class="mt-8 flex justify-end">
            <button class="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700" @click="step = 5">
              生成计划
            </button>
          </div>
        </template>

        <template v-else>
          <div class="text-center">
            <div class="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-green-100 text-2xl text-green-700 dark:bg-green-950 dark:text-green-300">
              <span class="i-carbon-checkmark-filled" />
            </div>
            <h1 class="mt-5 text-3xl font-bold text-gray-950 dark:text-white">
              完整学习路线已准备好
            </h1>
            <p class="mt-3 text-gray-500 dark:text-gray-400">
              从基础恢复开始，依次学习 IELTS 5.0、5.5、6.0 和 6.5 内容；达到目标分数后也不会跳过剩余题库。
            </p>
          </div>

          <dl class="grid mt-8 gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <dt class="text-sm text-gray-500">
                起始阶段
              </dt>
              <dd class="mt-1 text-xl font-bold text-gray-950 dark:text-white">
                基础恢复
              </dd>
            </div>
            <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <dt class="text-sm text-gray-500">
                目标阶段
              </dt>
              <dd class="mt-1 text-xl font-bold text-gray-950 dark:text-white">
                IELTS {{ targetBand.toFixed(1) }}
              </dd>
            </div>
            <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <dt class="text-sm text-gray-500">
                预计学习周期
              </dt>
              <dd class="mt-1 text-xl font-bold text-gray-950 dark:text-white">
                约 {{ estimate.estimatedDays }} 个学习日
              </dd>
            </div>
            <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <dt class="text-sm text-gray-500">
                每日学习时间
              </dt>
              <dd class="mt-1 text-xl font-bold text-gray-950 dark:text-white">
                {{ dailyMinutes }} 分钟
              </dd>
            </div>
          </dl>

          <p v-if="estimate.targetBeyondCurrentRoute" class="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            当前完整路线覆盖到 {{ getStage(estimate.routeEndsAt).label }}。选择 7.0 时会先学完现有全部阶段，之后继续安排复习与剩余资源。
          </p>

          <button class="mt-8 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white hover:bg-primary-700" @click="createPlan">
            从基础恢复开始学习
          </button>
        </template>
      </section>
    </div>
  </main>
</template>
