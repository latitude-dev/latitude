// syncViews.test.ts
import fs from 'fs'
import path from 'path'
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import syncFiles from '../shared/syncFiles'
import { syncDirectory, syncFnFactory } from '.'

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

let rootDir = ''
let destinationDir = ''
describe('snycFnFactory', () => {
  beforeEach(() => {
    // @ts-expect-error mock
    ;(syncFiles as vi.Mock).mockClear()
  })

  describe('when views folder exists', () => {
    rootDir = path.join('/tmp', `/test-${Math.random()}`)
    destinationDir = `${rootDir}/dist`

    beforeAll(() => {
      fs.mkdirSync(path.join(rootDir, 'views'), { recursive: true })
    })

    afterAll(() => {
      fs.rmSync(rootDir, { recursive: true })
    })

    it('handle add file', () => {
      const handler = syncFnFactory({ rootDir, destinationDir })

      const srcPath = `${rootDir}/views/example/index.html`
      handler(srcPath, 'add', true)

      const expectedDestPath = `${destinationDir}/example/+page.svelte`

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

    it('handle remove file', () => {
      const handler = syncFnFactory({ rootDir, destinationDir })

      const srcPathBefore = `${rootDir}/views/example/index.html`

      // Simulate adding a file before testing unlink
      handler(srcPathBefore, 'add', true)

      const srcPath = `${rootDir}/views/example/index.html`
      const type = 'unlink'

      // Perform the operation as handled during 'unlink'
      handler(srcPath, type, true)

      const expectedDestPath = `${destinationDir}/example/+page.svelte`

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

    it('does not sync files that match IGNORED_FILES_REGEX', () => {
      const handler = syncFnFactory({ rootDir, destinationDir })

      const srcPath = `${rootDir}/views/foo.png`
      const type = 'add'

      handler(srcPath, type, true)

      expect(syncFiles).not.toHaveBeenCalled()
    })
  })

  describe('when views folder does not exist', () => {
    it('does not fail', () => {
      const destinationDir = '/test/dist'

      console.log('rootDir', rootDir)
      const handler = syncFnFactory({ rootDir, destinationDir })

      const srcPath = `${rootDir}/views/example/index.html`
      const type = 'add'

      handler(srcPath, type, true)

      expect(syncFiles).not.toHaveBeenCalled()
    })
  })
})

describe('syncDirectory', () => {
  it('does not fail when does not exists', () => {
    const syncFn = vi.fn()
    const folder = '/tmp/does-not-exist'

    syncDirectory(folder, syncFn)

    expect(syncFn).not.toHaveBeenCalled()
  })
})
