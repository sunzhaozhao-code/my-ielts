<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCloudSync } from '~/composables/useCloudSync'

const cloudSync = useCloudSync()
const router = useRouter()
const email = ref('')
const sending = ref(false)
const notice = ref('')
const formError = ref('')

onMounted(async () => cloudSync.initialize())

async function sendLink() {
  if (!email.value.trim())
    return
  sending.value = true
  notice.value = ''
  formError.value = ''
  try {
    await cloudSync.sendMagicLink(email.value.trim())
    notice.value = '登录链接已发送，请在邮箱中打开。首次使用会自动创建账号。'
  }
  catch (error) {
    formError.value = error instanceof Error ? error.message : '发送失败，请稍后重试。'
  }
  finally {
    sending.value = false
  }
}

async function signOut() {
  if (await cloudSync.signOut())
    router.push('/onboarding')
}

function formatSyncTime(value: string | null) {
  return value ? new Date(value).toLocaleString('zh-CN') : '尚未同步'
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:py-10">
    <p class="text-sm font-semibold text-primary-700 dark:text-primary-400">
      学习账号
    </p>
    <h1 class="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
      在手机和电脑继续同一进度
    </h1>
    <p class="mt-3 leading-7 text-gray-500 dark:text-gray-400">
      登录是可选的。未登录时数据仍保存在当前浏览器；登录后，只有你的账号能够读取自己的学习记录。
    </p>

    <section v-if="!cloudSync.configured.value" class="mt-7 border border-amber-200 rounded-2xl bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
      <h2 class="font-bold text-amber-950 dark:text-amber-100">
        云端同步尚未配置
      </h2>
      <p class="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
        本地学习功能可以正常使用。管理员需要配置 Supabase 地址、Publishable Key，并执行项目内的数据库迁移脚本后才能开放登录。
      </p>
    </section>

    <section v-else-if="cloudSync.user.value" class="mt-7 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm text-gray-500">
            当前账号
          </p>
          <p class="mt-1 break-all text-lg font-semibold text-gray-950 dark:text-white">
            {{ cloudSync.user.value.email }}
          </p>
        </div>
        <span class="rounded-full px-3 py-1.5 text-sm" :class="cloudSync.state.status === 'synced' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300' : cloudSync.state.status === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' : 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'">
          {{ cloudSync.state.status === 'synced' ? '已同步' : cloudSync.state.status === 'syncing' ? '同步中' : cloudSync.state.status === 'conflict' ? '需要选择进度' : cloudSync.state.status === 'error' ? '同步失败' : '已登录' }}
        </span>
      </div>

      <div v-if="cloudSync.state.status === 'conflict'" class="mt-6 border border-amber-200 rounded-xl bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
        <h2 class="font-semibold text-amber-950 dark:text-amber-100">
          这台设备和云端都有学习进度
        </h2>
        <p class="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-200">
          为避免覆盖数据，请选择要继续使用的一份。选择后会同步到其他设备。
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white" @click="cloudSync.keepLocalData">
            使用这台设备的进度
          </button>
          <button class="border border-amber-300 rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-800 dark:border-amber-800 dark:bg-transparent dark:text-amber-200" @click="cloudSync.useRemoteData">
            使用云端进度
          </button>
        </div>
      </div>

      <p v-if="cloudSync.state.errorMessage" class="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
        {{ cloudSync.state.errorMessage }}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50" :disabled="cloudSync.state.status === 'syncing' || cloudSync.state.status === 'conflict'" @click="cloudSync.syncNow">
          立即同步
        </button>
        <button class="border border-gray-300 rounded-xl px-5 py-2.5 text-sm font-medium dark:border-gray-600" @click="signOut">
          退出登录
        </button>
      </div>
      <p class="mt-4 text-xs text-gray-400">
        最近同步：{{ formatSyncTime(cloudSync.state.lastSyncedAt) }}
      </p>
    </section>

    <section v-else-if="cloudSync.configured.value" class="mt-7 border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-bold text-gray-950 dark:text-white">
        邮箱登录或注册
      </h2>
      <p class="mt-2 text-sm leading-6 text-gray-500">
        我们会发送一次性登录链接，无需设置或记住密码。
      </p>
      <form class="mt-5" @submit.prevent="sendLink">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="account-email">邮箱地址</label>
        <input id="account-email" v-model="email" type="email" autocomplete="email" required class="mt-2 w-full border border-gray-300 rounded-xl bg-transparent px-4 py-3 outline-none dark:border-gray-600 focus:border-primary-500" placeholder="name@example.com">
        <button class="mt-4 w-full rounded-xl bg-primary-600 px-6 py-3 font-medium text-white disabled:opacity-50" :disabled="sending || !email.trim()" type="submit">
          {{ sending ? '正在发送…' : '发送登录链接' }}
        </button>
      </form>
      <p v-if="notice" class="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
        {{ notice }}
      </p>
      <p v-if="formError" class="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
        {{ formError }}
      </p>
    </section>

    <p class="mt-6 text-center text-sm text-gray-500">
      暂时不登录也没关系，<RouterLink to="/onboarding" class="font-medium text-primary-700 dark:text-primary-400 hover:underline">
        使用本地模式
      </RouterLink>
    </p>
  </div>
</template>
