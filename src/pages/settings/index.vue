<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { exportStudyData, importStudyData } from '~/services/studyStorage'
import type { DailyMinutes, TargetBand } from '~/types/study'

const studyStore = useStudyStore()
const router = useRouter()
const targetBand = ref<TargetBand>(studyStore.profile.value?.targetBand ?? 6.5)
const dailyMinutes = ref<DailyMinutes>(studyStore.profile.value?.dailyMinutes ?? 60)
const message = ref('')

function save() {
  studyStore.updateSettings(targetBand.value, dailyMinutes.value)
  message.value = '设置已保存。新时长从下一次生成任务时生效。'
}

function downloadData() {
  const blob = new Blob([exportStudyData(studyStore.state)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `my-ielts-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

async function uploadData(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file)
    return
  const result = importStudyData(await file.text())
  message.value = result.message
  if (result.ok && result.data) {
    studyStore.replaceData(result.data)
    targetBand.value = result.data.profile?.targetBand ?? 6.5
    dailyMinutes.value = result.data.profile?.dailyMinutes ?? 60
  }
  ;(event.target as HTMLInputElement).value = ''
}

function clearData() {
  // eslint-disable-next-line no-alert
  if (!window.confirm('确定清空全部学习记录吗？建议先导出备份。'))
    return
  studyStore.resetAllData()
  router.push('/onboarding')
}

function restartAssessment() {
  router.push('/onboarding?restart=1')
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:py-10">
    <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
      设置
    </p>
    <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
      学习计划与数据
    </h1>
    <p class="mt-3 text-gray-500 dark:text-gray-400">
      所有记录仅保存在当前浏览器。你可以随时导出 JSON 备份。
    </p>

    <p v-if="message" class="dark:bg-primary-950 mt-5 rounded-xl bg-primary-50 p-4 text-sm text-primary-800 dark:text-primary-200">
      {{ message }}
    </p>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-bold text-gray-950 dark:text-white">
        计划设置
      </h2>
      <p class="mt-5 text-sm font-medium text-gray-600 dark:text-gray-300">
        目标分数
      </p>
      <div class="grid grid-cols-3 mt-3 gap-3">
        <button v-for="band in ([6, 6.5, 7] as TargetBand[])" :key="band" class="border rounded-xl px-4 py-3 font-semibold" :class="targetBand === band ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700'" @click="targetBand = band">
          {{ band.toFixed(1) }}
        </button>
      </div>
      <p class="mt-6 text-sm font-medium text-gray-600 dark:text-gray-300">
        每日学习时间
      </p>
      <div class="grid grid-cols-2 mt-3 gap-3 sm:grid-cols-4">
        <button v-for="minutes in ([30, 45, 60, 90] as DailyMinutes[])" :key="minutes" class="border rounded-xl px-4 py-3 font-semibold" :class="dailyMinutes === minutes ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'border-gray-200 dark:border-gray-700'" @click="dailyMinutes = minutes">
          {{ minutes }} 分钟
        </button>
      </div>
      <button class="mt-7 rounded-xl bg-primary-600 px-6 py-3 font-medium text-white" @click="save">
        保存设置
      </button>
    </section>

    <section class="mt-5 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-bold text-gray-950 dark:text-white">
        数据管理
      </h2>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="border border-gray-300 rounded-xl px-5 py-2.5 text-sm font-medium dark:border-gray-600" @click="downloadData">
          导出学习数据 JSON
        </button><label class="cursor-pointer border border-gray-300 rounded-xl px-5 py-2.5 text-sm font-medium dark:border-gray-600">导入学习数据 JSON<input type="file" accept="application/json,.json" class="hidden" @change="uploadData"></label>
      </div>
      <div class="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
        <button class="mr-3 text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline" @click="restartAssessment">
          重新水平测试
        </button><button class="text-sm font-medium text-red-600 hover:underline" @click="clearData">
          清空学习记录
        </button>
      </div>
    </section>
  </div>
</template>
