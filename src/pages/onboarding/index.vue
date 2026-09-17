<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { ASSESSMENT_QUESTIONS } from '~/data/assessment'
import { getStage } from '~/data/stages'
import { estimateStudyDays, getPlacement } from '~/domain/study/placement'
import type { DailyMinutes, TargetBand, UserProfile } from '~/types/study'

defineOptions({ name: 'OnboardingPage' })

const router = useRouter()
const route = useRoute()
const studyStore = useStudyStore()
const step = ref(1)
const questionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const score = ref(0)
const targetBand = ref<TargetBand>(6.5)
const dailyMinutes = ref<DailyMinutes>(60)

const question = computed(() => ASSESSMENT_QUESTIONS[questionIndex.value])
const placement = computed(() => getPlacement(score.value))
const estimate = computed(() => estimateStudyDays(placement.value, targetBand.value, dailyMinutes.value))
const progress = computed(() => Math.round((questionIndex.value + 1) / ASSESSMENT_QUESTIONS.length * 100))

function submitAnswer() {
  if (selectedAnswer.value === null)
    return

  if (selectedAnswer.value === question.value.answer)
    score.value++

  if (questionIndex.value === ASSESSMENT_QUESTIONS.length - 1) {
    step.value = 3
  }
  else {
    questionIndex.value++
    selectedAnswer.value = null
  }
}

function createPlan() {
  const now = new Date().toISOString()
  const profile: UserProfile = {
    assessmentScore: score.value,
    startingStage: placement.value.stage,
    targetBand: targetBand.value,
    dailyMinutes: dailyMinutes.value,
    createdAt: now,
    updatedAt: now,
  }
  if (route.query.restart === '1')
    studyStore.reconfigureAfterAssessment(profile, placement.value.stageInitialProgress)
  else
    studyStore.completeOnboarding(profile, placement.value.stageInitialProgress)
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
              My IELTS 学习计划
            </p>
            <h1 class="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl dark:text-white">
              每天打开，只学今天该学的内容。
            </h1>
            <p class="mt-5 leading-7 text-gray-500 dark:text-gray-400">
              先用 15 道简单题了解你的基础，再按照目标分数和可用时间自动安排每天的学习任务。
            </p>
            <button class="mt-8 rounded-xl bg-primary-600 px-7 py-3 font-medium text-white hover:bg-primary-700" @click="step = 2">
              开始测试
            </button>
            <p class="mt-5 text-sm text-gray-500">
              已经有学习账号？<RouterLink to="/account" class="font-medium text-primary-700 dark:text-primary-400 hover:underline">
                登录并同步进度
              </RouterLink>
            </p>
          </div>
        </template>

        <template v-else-if="step === 2">
          <div class="mb-8 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-primary-700 dark:text-primary-400">
                基础水平测试
              </p>
              <h1 class="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
                第 {{ questionIndex + 1 }} / {{ ASSESSMENT_QUESTIONS.length }} 题
              </h1>
            </div>
            <span class="text-sm text-gray-500">{{ progress }}%</span>
          </div>

          <div class="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div class="h-full rounded-full bg-primary-600 transition-width" :style="{ width: `${progress}%` }" />
          </div>

          <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60 sm:p-6">
            <p class="mb-3 text-xs font-semibold tracking-wide uppercase text-gray-400">
              {{ question.category === 'vocabulary' ? '词汇' : question.category === 'grammar' ? '语法' : '阅读' }}
            </p>
            <p v-if="question.passage" class="mb-5 border-l-3 border-primary-400 pl-4 leading-7 text-gray-600 dark:text-gray-300">
              {{ question.passage }}
            </p>
            <h2 class="text-lg font-semibold leading-7 text-gray-950 dark:text-white">
              {{ question.prompt }}
            </h2>
          </div>

          <div class="grid mt-5 gap-3 sm:grid-cols-2">
            <button
              v-for="(option, index) in question.options"
              :key="option"
              class="border rounded-xl p-4 text-left transition"
              :class="selectedAnswer === index ? 'border-primary-600 bg-primary-50 text-primary-900 dark:bg-primary-950 dark:text-primary-100' : 'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700'"
              @click="selectedAnswer = index"
            >
              <span class="mr-2 text-sm text-gray-400">{{ String.fromCharCode(65 + index) }}.</span>{{ option }}
            </button>
          </div>

          <div class="mt-7 flex justify-end">
            <button class="rounded-xl bg-primary-600 px-6 py-3 font-medium text-white disabled:cursor-not-allowed hover:bg-primary-700 disabled:opacity-40" :disabled="selectedAnswer === null" @click="submitAnswer">
              {{ questionIndex === ASSESSMENT_QUESTIONS.length - 1 ? '查看结果' : '下一题' }}
            </button>
          </div>
        </template>

        <template v-else-if="step === 3">
          <p class="text-sm font-medium text-primary-700 dark:text-primary-400">
            第 3 步
          </p>
          <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            你的目标分数
          </h1>
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            第一版课程覆盖到 6.5，选择 7.0 会先安排到 6.5 的路线。
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
            第 4 步
          </p>
          <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            每天能学习多久？
          </h1>
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            不需要一次学完，可以分成几段完成。默认推荐 60 分钟。
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
              学习计划已准备好
            </h1>
            <p class="mt-3 text-gray-500 dark:text-gray-400">
              测试得分 {{ score }} / 15。计划会随着完成情况继续向前推进。
            </p>
          </div>

          <dl class="grid mt-8 gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <dt class="text-sm text-gray-500">
                当前阶段
              </dt>
              <dd class="mt-1 text-xl font-bold text-gray-950 dark:text-white">
                {{ placement.label }}
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
            当前预计周期计算到 {{ getStage(estimate.routeEndsAt).label }}。7.0 阶段的数据结构已预留，后续内容扩展时可直接继续。
          </p>

          <button class="mt-8 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white hover:bg-primary-700" @click="createPlan">
            进入今日学习
          </button>
        </template>
      </section>
    </div>
  </main>
</template>
