import { describe, expect, it } from 'vitest'
import { decideSyncAction } from '../../src/domain/sync/syncDecision'

const base = {
  localHasData: true,
  remoteExists: true,
  localOwner: 'user-1',
  userId: 'user-1',
  localUpdatedAt: '2026-09-10T10:00:00.000Z',
  remoteUpdatedAt: '2026-09-10T09:00:00.000Z',
}

describe('cloud sync decision', () => {
  it('uploads an existing local plan when the cloud is empty', () => {
    expect(decideSyncAction({ ...base, remoteExists: false })).toBe('upload-local')
  })

  it('downloads cloud data on a new device', () => {
    expect(decideSyncAction({ ...base, localHasData: false })).toBe('download-remote')
  })

  it('requires a choice when guest and cloud progress both exist', () => {
    expect(decideSyncAction({ ...base, localOwner: 'guest' })).toBe('conflict')
    expect(decideSyncAction({ ...base, localOwner: null })).toBe('conflict')
  })

  it('never uploads progress owned by a different account', () => {
    expect(decideSyncAction({ ...base, localOwner: 'user-2' })).toBe('download-remote')
    expect(decideSyncAction({ ...base, localOwner: 'user-2', remoteExists: false })).toBe('none')
  })

  it('uses timestamps for data already owned by the signed-in user', () => {
    expect(decideSyncAction(base)).toBe('upload-local')
    expect(decideSyncAction({ ...base, remoteUpdatedAt: '2026-09-10T11:00:00.000Z' })).toBe('download-remote')
    expect(decideSyncAction({ ...base, remoteUpdatedAt: base.localUpdatedAt })).toBe('none')
  })
})
