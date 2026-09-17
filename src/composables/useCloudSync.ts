import type { User } from '@supabase/supabase-js'
import { computed, reactive, watch } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { decideSyncAction } from '~/domain/sync/syncDecision'
import { fetchCloudStudyData, saveCloudStudyData } from '~/services/cloudStudyData'
import { isCloudSyncConfigured, supabase } from '~/services/supabaseClient'
import type { StudyData } from '~/types/study'

type CloudSyncStatus = 'unconfigured' | 'signed-out' | 'syncing' | 'synced' | 'conflict' | 'error'

const LOCAL_OWNER_KEY = 'my-ielts:study-owner'
const GUEST_OWNER = 'guest'
const studyStore = useStudyStore()
const cloudState = reactive<{
  initialized: boolean
  status: CloudSyncStatus
  user: User | null
  errorMessage: string
  lastSyncedAt: string | null
}>({
  initialized: false,
  status: isCloudSyncConfigured ? 'signed-out' : 'unconfigured',
  user: null,
  errorMessage: '',
  lastSyncedAt: null,
})

let initializePromise: Promise<void> | null = null
let syncPromise: Promise<void> | null = null
let uploadTimer: number | null = null
let pendingRemoteData: StudyData | null = null
let suppressedUpdatedAt: string | null = null
let listenersInstalled = false

function getLocalOwner() {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(LOCAL_OWNER_KEY)
}

function setLocalOwner(owner: string) {
  if (typeof window !== 'undefined')
    window.localStorage.setItem(LOCAL_OWNER_KEY, owner)
}

function hasLocalLearningData() {
  return Boolean(studyStore.profile.value)
}

function applyRemoteData(data: StudyData) {
  suppressedUpdatedAt = data.updatedAt
  studyStore.replaceDataFromCloud(data)
}

async function uploadLocalData() {
  if (!cloudState.user || !hasLocalLearningData())
    return
  await saveCloudStudyData(cloudState.user.id, studyStore.state)
  setLocalOwner(cloudState.user.id)
  cloudState.lastSyncedAt = new Date().toISOString()
}

async function reconcileUser(user: User) {
  let owner = getLocalOwner()
  if (owner && owner !== GUEST_OWNER && owner !== user.id)
    studyStore.resetAllData()

  const remote = await fetchCloudStudyData(user.id)
  if (owner && owner !== GUEST_OWNER && owner !== user.id)
    owner = null
  const action = decideSyncAction({
    localHasData: hasLocalLearningData(),
    remoteExists: Boolean(remote),
    localOwner: owner,
    userId: user.id,
    localUpdatedAt: studyStore.state.updatedAt,
    remoteUpdatedAt: remote?.updatedAt,
  })

  if (action === 'conflict') {
    pendingRemoteData = remote!.data
    setLocalOwner(GUEST_OWNER)
    cloudState.status = 'conflict'
    return 'conflict' as const
  }
  if (action === 'download-remote')
    applyRemoteData(remote!.data)
  else if (action === 'upload-local')
    await uploadLocalData()

  setLocalOwner(user.id)
  return 'done' as const
}

async function syncNow() {
  if (!cloudState.user || cloudState.status === 'conflict')
    return
  if (syncPromise)
    return syncPromise

  syncPromise = (async () => {
    cloudState.status = 'syncing'
    cloudState.errorMessage = ''
    try {
      const result = await reconcileUser(cloudState.user!)
      if (result !== 'conflict') {
        cloudState.status = 'synced'
        cloudState.lastSyncedAt = new Date().toISOString()
      }
    }
    catch (error) {
      cloudState.status = 'error'
      cloudState.errorMessage = error instanceof Error ? error.message : '云端同步失败。'
    }
    finally {
      syncPromise = null
    }
  })()
  return syncPromise
}

function scheduleUpload() {
  if (!cloudState.user || cloudState.status === 'conflict')
    return
  if (uploadTimer !== null)
    window.clearTimeout(uploadTimer)
  uploadTimer = window.setTimeout(async () => {
    uploadTimer = null
    cloudState.status = 'syncing'
    try {
      await uploadLocalData()
      cloudState.status = 'synced'
      cloudState.errorMessage = ''
    }
    catch (error) {
      cloudState.status = 'error'
      cloudState.errorMessage = error instanceof Error ? error.message : '云端同步失败。'
    }
  }, 1200)
}

function installListeners() {
  if (listenersInstalled || typeof window === 'undefined')
    return
  listenersInstalled = true

  watch(() => studyStore.state.updatedAt, (updatedAt) => {
    if (updatedAt === suppressedUpdatedAt) {
      suppressedUpdatedAt = null
      return
    }
    if (!cloudState.user) {
      if (hasLocalLearningData())
        setLocalOwner(GUEST_OWNER)
      return
    }
    scheduleUpload()
  })

  window.addEventListener('online', () => {
    syncNow()
  })
  window.addEventListener('focus', () => {
    syncNow()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible')
      syncNow()
  })
}

async function initialize() {
  if (initializePromise)
    return initializePromise

  initializePromise = (async () => {
    installListeners()
    if (!supabase) {
      cloudState.initialized = true
      cloudState.status = 'unconfigured'
      return
    }

    const { data, error } = await supabase.auth.getSession()
    if (error) {
      cloudState.status = 'error'
      cloudState.errorMessage = error.message
    }
    else if (data.session?.user) {
      cloudState.user = data.session.user
      await syncNow()
    }
    else {
      // Keep the local snapshot if a session expires unexpectedly. Explicit
      // sign-out clears it below, and a different account is isolated during
      // reconciliation before any upload can occur.
      cloudState.status = 'signed-out'
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        cloudState.user = null
        cloudState.status = 'signed-out'
        return
      }
      if (session?.user && session.user.id !== cloudState.user?.id) {
        cloudState.user = session.user
        window.setTimeout(() => {
          syncNow()
        }, 0)
      }
    })
    cloudState.initialized = true
  })()

  return initializePromise
}

function authRedirectUrl() {
  const url = new URL(window.location.href)
  url.search = 'auth=callback'
  url.hash = '/account'
  return url.toString()
}

async function sendMagicLink(email: string) {
  if (!supabase)
    throw new Error('尚未配置 Supabase。')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: authRedirectUrl(),
      shouldCreateUser: true,
    },
  })
  if (error)
    throw error
}

async function signOut() {
  if (!supabase)
    return false
  if (cloudState.status === 'conflict') {
    cloudState.errorMessage = '请先选择保留本机进度或云端进度，再退出登录。'
    return false
  }
  if (cloudState.user) {
    try {
      await uploadLocalData()
    }
    catch (error) {
      cloudState.status = 'error'
      cloudState.errorMessage = `退出前同步失败，本地数据仍已保留：${error instanceof Error ? error.message : '请稍后重试。'}`
      return false
    }
  }
  const { error } = await supabase.auth.signOut()
  if (error) {
    cloudState.status = 'error'
    cloudState.errorMessage = error.message
    return false
  }
  cloudState.user = null
  cloudState.status = 'signed-out'
  pendingRemoteData = null
  studyStore.resetAllData()
  setLocalOwner(GUEST_OWNER)
  return true
}

async function keepLocalData() {
  if (!cloudState.user)
    return
  pendingRemoteData = null
  cloudState.status = 'syncing'
  try {
    await uploadLocalData()
    cloudState.status = 'synced'
  }
  catch (error) {
    cloudState.status = 'error'
    cloudState.errorMessage = error instanceof Error ? error.message : '云端同步失败。'
  }
}

function useRemoteData() {
  if (!cloudState.user || !pendingRemoteData)
    return
  applyRemoteData(pendingRemoteData)
  pendingRemoteData = null
  setLocalOwner(cloudState.user.id)
  cloudState.status = 'synced'
  cloudState.lastSyncedAt = new Date().toISOString()
}

export function useCloudSync() {
  return {
    state: cloudState,
    configured: computed(() => isCloudSyncConfigured),
    user: computed(() => cloudState.user),
    initialize,
    syncNow,
    sendMagicLink,
    signOut,
    keepLocalData,
    useRemoteData,
  }
}
