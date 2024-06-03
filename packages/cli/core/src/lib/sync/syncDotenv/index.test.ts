import * as fs from 'fs'
import config from '$src/config'
import path from 'path'
import syncDotenv from '.'
import syncFiles from '../shared/syncFiles'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import watcher from '../shared/watcher'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}))
vi.mock('$src/config', () => ({
  default: { rootDir: '/mocked/path' },
}))
vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))
vi.mock('../shared/watcher', () => ({ default: vi.fn() }))

const APP_FOLDER = '.latitude/app'

describe('syncDotenv', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts the watcher', () => {
    syncDotenv({ watch: true })

    expect(syncFiles).not.toHaveBeenCalled()
    expect(watcher).toHaveBeenCalledWith(
      '/mocked/path/.env',
      expect.any(Function),
    )
  })

  it('does nothing if .env file does not exist', () => {
    // @ts-expect-error mock
    ;(fs.existsSync as vi.Mock).mockReturnValueOnce(false)

    syncDotenv()
    expect(fs.existsSync).toHaveBeenCalled()
    expect(syncFiles).not.toHaveBeenCalled()
  })

  it('syncs .env file to the app folder if it exists', () => {
    // @ts-expect-error mock
    ;(fs.existsSync as vi.Mock).mockReturnValueOnce(true)

    syncDotenv()

    const expectedSrcPath = path.join(config.rootDir, '.env')
    const expectedDestPath = path.join(config.rootDir, APP_FOLDER, '.env')

    expect(fs.existsSync).toHaveBeenCalledWith(expectedSrcPath)
    expect(syncFiles).toHaveBeenCalledWith({
      srcPath: expectedSrcPath,
      destPath: expectedDestPath,
      relativePath: '.env',
      type: 'add',
      ready: true,
    })
  })
})
