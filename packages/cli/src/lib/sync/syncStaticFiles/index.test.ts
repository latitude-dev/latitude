// syncStaticFiles.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { syncStaticFilesFn } from '.' // Adjust this path to the actual path of your module
import syncFiles from '../shared/syncFiles'

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

describe('syncStaticFiles function', () => {
  beforeEach(() => {
    // @ts-expect-error mock
    ;(syncFiles as vi.Mock).mockClear()
  })

  it('correctly handles "add" type operation by syncing new file', () => {
    const rootDir = '/test'
    const destinationDir = '/test/static'

    // Make the syncStaticFilesFn function ready for tests
    const handler = syncStaticFilesFn({ rootDir, destinationDir })

    const srcPath = `${rootDir}/views/example/funny_cat.png`
    const type = 'add'

    // Perform the operation as handled during 'add'
    handler(srcPath, type, true)

    const expectedDestPath = '/test/static/example/funny_cat.png'

    expect(syncFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        srcPath: srcPath,
        destPath: expectedDestPath,
        relativePath: 'example/funny_cat.png',
        type: 'add',
        ready: true,
      }),
    )
  })

  it('correctly handles "unlink" type operation by removing a synced file', () => {
    const rootDir = '/test'
    const destinationDir = '/test/static'

    const handler = syncStaticFilesFn({ rootDir, destinationDir })

    const srcPathBefore = `${rootDir}/views/example/funny_cat.png`

    // Simulate adding a file before testing unlink
    handler(srcPathBefore, 'add', true)

    const srcPath = `${rootDir}/views/example/funny_cat.png`
    const type = 'unlink'

    // Perform the operation as handled during 'unlink'
    handler(srcPath, type, true)

    const expectedDestPath = '/test/static/example/funny_cat.png'

    expect(syncFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        srcPath: srcPath,
        destPath: expectedDestPath,
        relativePath: 'example/funny_cat.png',
        type: 'unlink',
        ready: true,
      }),
    )
  })

  it('does not sync files that match IGNORED_FILES_REGEX', () => {
    const rootDir = '/test'
    const destinationDir = '/test/static'

    const handler = syncStaticFilesFn({ rootDir, destinationDir })

    const srcPath = `${rootDir}/views/index.html`
    const type = 'add'

    handler(srcPath, type, true)

    expect(syncFiles).not.toHaveBeenCalled()
  })

  it('does not sync files that match IGNORED_FILES_REGEX even if nested', () => {
    const rootDir = '/test'
    const destinationDir = '/test/static'

    const handler = syncStaticFilesFn({ rootDir, destinationDir })

    const srcPath = `${rootDir}/views/nested/index.html`
    const type = 'add'

    handler(srcPath, type, true)

    expect(syncFiles).not.toHaveBeenCalled()
  })
})
