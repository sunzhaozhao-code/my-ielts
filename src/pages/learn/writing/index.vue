<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStudyStore } from '~/composables/useStudyStore'
import { WRITING_CONNECTORS, selectWritingTask } from '~/data/writingTasks'

const route = useRoute()
const studyStore = useStudyStore()
const taskId = typeof route.query.task === 'string' ? route.query.task : undefined
const task = selectWritingTask(studyStore.progress.value.currentStage, studyStore.progress.value.courseDay)
const resourceId = `writing:${task.id}`
const existing = studyStore.state.writingDrafts[resourceId]
const content = ref(existing?.content ?? '')
const elapsedSeconds = ref(0)
const running = ref(false)
const completed = ref(Boolean(existing?.completedAt))
const completedAt = ref(existing?.completedAt)
let timer: number | null = null

const wordCount = computed(() => content.value.trim() ? content.value.trim().split(/\s+/).length : 0)

function toggleTimer() {
  running.value = !running.value
  if (running.value) {
    timer = window.setInterval(() => elapsedSeconds.value++, 1000)
  }
  else if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

function saveDraft(markCompleted = false) {
  if (markCompleted && !completedAt.value)
    completedAt.value = new Date().toISOString()
  studyStore.saveWritingDraft({ resourceId, taskId, prompt: task.prompt, content: content.value, updatedAt: new Date().toISOString(), completedAt: completedAt.value })
}

function finish() {
  if (!content.value.trim())
    return
  if (running.value)
    toggleTimer()
  completed.value = true
  saveDraft(true)
  studyStore.addSkillAttempt({ type: 'writing', resourceId, durationSeconds: elapsedSeconds.value })
  studyStore.completeTaskWithResult(taskId)
}

let saveTimeout: number | null = null
watch(content, () => {
  if (saveTimeout !== null)
    window.clearTimeout(saveTimeout)
  saveTimeout = window.setTimeout(() => saveDraft(), 500)
})

onUnmounted(() => {
  if (timer !== null)
    window.clearInterval(timer)
  if (saveTimeout !== null)
    window.clearTimeout(saveTimeout)
  saveDraft()
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:py-10">
    <RouterLink to="/" class="text-sm font-medium text-primary-700 dark:text-primary-400 hover:underline">
      ← 返回今日学习
    </RouterLink>
    <header class="mt-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
          无 AI 写作训练
        </p><h1 class="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
          {{ task.title }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="rounded-full bg-gray-100 px-4 py-2 text-sm font-mono dark:bg-gray-800">{{ Math.floor(elapsedSeconds / 60) }}:{{ String(elapsedSeconds % 60).padStart(2, '0') }}</span><button class="border border-gray-300 rounded-lg px-4 py-2 text-sm dark:border-gray-600" @click="toggleTimer">
          {{ running ? '暂停' : '开始计时' }}
        </button>
      </div>
    </header>

    <section class="mt-6 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p class="leading-7 text-gray-900 dark:text-white">
        {{ task.prompt }}
      </p>
      <div class="grid mt-5 gap-4 lg:grid-cols-2">
        <div>
          <h2 class="text-sm font-semibold text-gray-500">
            建议结构
          </h2><ol class="mt-2 list-decimal pl-5 text-sm text-gray-600 space-y-1 dark:text-gray-300">
            <li v-for="item in task.outline" :key="item">
              {{ item }}
            </li>
          </ol>
        </div>
        <div>
          <h2 class="text-sm font-semibold text-gray-500">
            可用连接词
          </h2><div class="mt-2 flex flex-wrap gap-2">
            <button v-for="connector in WRITING_CONNECTORS" :key="connector" class="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700 hover:bg-primary-50" @click="content += `${content ? ' ' : ''}${connector}, `">
              {{ connector }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-5 border border-gray-200 rounded-2xl bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <textarea v-model="content" class="min-h-96 w-full resize-y bg-transparent p-2 leading-8 outline-none" :placeholder="`在这里开始写作，建议至少 ${task.suggestedWords} 词……`" />
      <div class="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-700">
        <span :class="wordCount >= task.suggestedWords ? 'text-green-600' : 'text-gray-500'">{{ wordCount }} / {{ task.suggestedWords }} 词</span><span class="text-gray-400">内容自动保存在本机</span>
      </div>
    </section>

    <button v-if="!completed" class="mt-5 w-full rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white disabled:opacity-40" :disabled="!content.trim()" @click="finish">
      保存并标记完成
    </button>
    <div v-else class="mt-5 rounded-xl bg-green-50 p-5 text-center text-green-800 dark:bg-green-950/30 dark:text-green-300">
      写作已保存并完成。本版本不会自动评分或调用 AI。<RouterLink to="/" class="ml-2 font-medium underline">
        返回今日学习
      </RouterLink>
    </div>
  </div>
</template>
