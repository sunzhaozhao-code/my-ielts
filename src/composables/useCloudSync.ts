import type { User } from '@supabase/supabase-js'
import { computed, reactive, watch } from 'vue'
import { useStudyStore } from '~/composables/useStudyStore'
import { decideSyncAction } from '~/domain/sync/syncDecision'
import { deleteCloudStudyData, fetchCloudStudyData, saveCloudStudyData } from '~/services/cloudStudyData'
import { isCloudSyncConfigured, supabase } from '~/services/supabaseClient'
import type { StudyData } from '~/types/study'

type CloudSyncStatus = 'unconfigured' | 'signed-out' | 'syncing' | 'synced' | 'conflict' | 'error'

const LOCAL_OWNER_KEY = 'my-ielts:study-owner'
const SYNC_META_KEY_PREFIX = 'my-ielts:sync-meta:'
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
let pendingRemoteDeleted = false
let suppressedUpdatedAt: string | null = null
let listenersInstalled = false

interface SyncMeta {
  localUpdatedAt: string
  remoteUpdatedAt: string | null
}

function getLocalOwner() {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(LOCAL_OWNER_KEY)
}

function setLocalOwner(owner: string) {
  if (typeof window !== 'undefined')
    window.localStorage.setItem(LOCAL_OWNER_KEY, owner)
}

function getSyncMeta(userId: string): SyncMeta | null {
  if (typeof window === 'undefined')
    return null
  try {
    const raw = window.localStorage.getItem(`${SYNC_META_KEY_PREFIX}${userId}`)
    return raw ? JSON.parse(raw) as SyncMeta : null
  }
  catch {
    return null
  }
}

function setSyncMeta(userId: string, remoteUpdatedAt: string | null) {
  if (typeof window === 'undefined')
    return
  window.localStorage.setItem(`${SYNC_META_KEY_PREFIX}${userId}`, JSON.stringify({
    localUpdatedAt: studyStore.state.updatedAt,
    remoteUpdatedAt,
  } satisfies SyncMeta))
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
  setSyncMeta(cloudState.user.id, studyStore.state.updatedAt)
  cloudState.lastSyncedAt = new Date().toISOString()
}

async function reconcileUser(user: User) {
  let owner = getLocalOwner()
  if (owner && owner !== GUEST_OWNER && owner !== user.id)
    studyStore.resetAllData()

  const remote = await fetchCloudStudyData(user.id)
  if (owner && owner !== GUEST_OWNER && owner !== user.id)
    owner = null

  const syncMeta = owner === user.id ? getSyncMeta(user.id) : null
  if (syncMeta) {
    const localChanged = studyStore.state.updatedAt !== syncMeta.localUpdatedAt
    const remoteChanged = (remote?.updatedAt ?? null) !== syncMeta.remoteUpdatedAt

    if (localChanged && remoteChanged) {
      pendingRemoteData = remote?.data ?? null
      pendingRemoteDeleted = !remote
      cloudState.status = 'conflict'
      return 'conflict' as const
    }
    if (remoteChanged) {
      if (remote)
        applyRemoteData(remote.data)
      else
        studyStore.resetAllData()
      setSyncMeta(user.id, remote?.updatedAt ?? null)
      setLocalOwner(user.id)
      return 'done' as const
    }
    if (localChanged) {
      await uploadLocalData()
      return 'done' as const
    }
    return 'done' as const
  }

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
    pendingRemoteDeleted = false
    setLocalOwner(GUEST_OWNER)
    cloudState.status = 'conflict'
    return 'conflict' as const
  }
  if (action === 'download-remote') {
    applyRemoteData(remote!.data)
    setSyncMeta(user.id, remote!.updatedAt)
  }
  else if (action === 'upload-local')
    await uploadLocalData()
  else
    setSyncMeta(user.id, remote?.updatedAt ?? null)

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
    await syncNow()
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
    await syncNow()
    if ((cloudState.status as CloudSyncStatus) === 'conflict') {
      cloudState.errorMessage = '另一台设备也修改了进度，请先选择保留本机或云端进度。'
      return false
    }
    if (cloudState.status === 'error') {
      cloudState.errorMessage = `退出前同步失败，本地数据仍已保留：${cloudState.errorMessage || '请稍后重试。'}`
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
  pendingRemoteDeleted = false
  studyStore.resetAllData()
  setLocalOwner(GUEST_OWNER)
  return true
}

async function keepLocalData() {
  if (!cloudState.user)
    return
  pendingRemoteData = null
  pendingRemoteDeleted = false
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
  if (!cloudState.user || (!pendingRemoteData && !pendingRemoteDeleted))
    return
  const remoteWasDeleted = pendingRemoteDeleted
  if (pendingRemoteData)
    applyRemoteData(pendingRemoteData)
  else
    studyStore.resetAllData()
  pendingRemoteData = null
  pendingRemoteDeleted = false
  setLocalOwner(cloudState.user.id)
  setSyncMeta(cloudState.user.id, remoteWasDeleted ? null : studyStore.state.updatedAt)
  cloudState.status = 'synced'
  cloudState.lastSyncedAt = new Date().toISOString()
}

async function deleteAllProgress() {
  if ((cloudState.status as CloudSyncStatus) === 'conflict')
    throw new Error('请先处理本机与云端进度冲突。')

  if (uploadTimer !== null) {
    window.clearTimeout(uploadTimer)
    uploadTimer = null
  }
  if (syncPromise)
    await syncPromise
  if (cloudState.status === 'conflict')
    throw new Error('另一台设备也修改了进度，请先处理同步冲突。')

  cloudState.status = cloudState.user ? 'syncing' : 'signed-out'
  if (cloudState.user)
    await deleteCloudStudyData(cloudState.user.id)

  pendingRemoteData = null
  pendingRemoteDeleted = false
  studyStore.resetAllData()
  setLocalOwner(cloudState.user?.id ?? GUEST_OWNER)
  if (cloudState.user)
    setSyncMeta(cloudState.user.id, null)
  cloudState.status = cloudState.user ? 'synced' : 'signed-out'
  cloudState.lastSyncedAt = new Date().toISOString()
  cloudState.errorMessage = ''
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
    deleteAllProgress,
  }
}
