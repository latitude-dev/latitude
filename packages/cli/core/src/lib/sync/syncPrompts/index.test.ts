import { describe, expect, it, vi } from 'vitest'
import { syncDirectory } from './index'

describe('syncDirectory', () => {
  it('does not fail when does not exists', () => {
    const syncFn = vi.fn()
    const folder = '/prompts/somthing.prompt'

    syncDirectory(folder, syncFn)

    expect(syncFn).not.toHaveBeenCalled()
  })
})
