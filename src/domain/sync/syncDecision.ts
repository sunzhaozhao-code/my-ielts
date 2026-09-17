export type SyncDecision = 'upload-local' | 'download-remote' | 'conflict' | 'none'

export function decideSyncAction(input: {
  localHasData: boolean
  remoteExists: boolean
  localOwner: string | null
  userId: string
  localUpdatedAt: string
  remoteUpdatedAt?: string
}): SyncDecision {
  if (input.localOwner && input.localOwner !== 'guest' && input.localOwner !== input.userId)
    return input.remoteExists ? 'download-remote' : 'none'
  if (!input.remoteExists)
    return input.localHasData ? 'upload-local' : 'none'
  if (!input.localHasData)
    return 'download-remote'
  if (!input.localOwner || input.localOwner === 'guest')
    return 'conflict'

  const localTime = Date.parse(input.localUpdatedAt)
  const remoteTime = Date.parse(input.remoteUpdatedAt ?? '')
  if (remoteTime > localTime)
    return 'download-remote'
  if (localTime > remoteTime)
    return 'upload-local'
  return 'none'
}
