// syncViews.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { syncFnFactory } from '.' // Adjust this path to the actual path of your module
import syncFiles from '../shared/syncFiles'

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

describe('syncFile function', () => {
  beforeEach(() => {
    // @ts-expect-error mock
    ;(syncFiles as vi.Mock).mockClear()
  })

  it('correctly handles "add" type operation by syncing new file', () => {
    const rootDir = '/test'
    const destinationDir = '/test/dist'

    // Make the syncFile function ready for tests
    const handler = syncFnFactory({ rootDir, destinationDir })

    const srcPath = `${rootDir}/views/example/index.html`
    const type = 'add'

    // Perform the operation as handled during 'add'
    handler(srcPath, type, true)

    const expectedDestPath = '/test/dist/example/+page.svelte'

    expect(syncFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        srcPath: srcPath,
        destPath: expectedDestPath,
        relativePath: '/example/+page.svelte',
        type: 'add',
        ready: true,
      }),
    )
  })

  it('correctly handles "unlink" type operation by removing a synced file', () => {
    const rootDir = '/test'
    const destinationDir = '/test/dist'

    const handler = syncFnFactory({ rootDir, destinationDir })

    const srcPathBefore = `${rootDir}/views/example/index.html`

    // Simulate adding a file before testing unlink
    handler(srcPathBefore, 'add', true)

    const srcPath = `${rootDir}/views/example/index.html`
    const type = 'unlink'

    // Perform the operation as handled during 'unlink'
    handler(srcPath, type, true)

    const expectedDestPath = '/test/dist/example/+page.svelte'

    expect(syncFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        srcPath: srcPath,
        destPath: expectedDestPath,
        relativePath: '/example/+page.svelte',
        type: 'unlink',
        ready: true,
      }),
    )
  })
})
