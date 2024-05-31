import fs from 'fs'
import path from 'path'
import { describe, it, expect, vi } from 'vitest'
import { findRootDir } from '.'
import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'
import { beforeEach } from 'node:test'

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
  },
}))
vi.mock('path', async (importOriginal) => ({
  default: {
    ...((await importOriginal()) as Record<string, unknown>),
    dirname: vi.fn(),
  },
}))
vi.mock('process', () => ({
  cwd: vi.fn(),
}))
vi.mock('$src/utils', () => ({
  onError: vi.fn(),
}))

describe('findRootDir', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should find latitude.json in the current working directory', () => {
    const currentDir = '/path/to/current/dir'
    process.cwd = vi.fn().mockReturnValue(currentDir)
    // @ts-expect-error mock
    fs.existsSync.mockImplementation((filePath: string) =>
      filePath.includes(LATITUDE_CONFIG_FILE),
    )

    expect(findRootDir()).toBe(currentDir)
  })

  it('should find latitude.json in a parent directory', () => {
    const currentDir = '/path/to/current/dir'
    const parentDir = '/path/to'
    process.cwd = vi.fn().mockReturnValue(currentDir)
    // @ts-expect-error mock
    path.dirname.mockReturnValueOnce(parentDir)

    // @ts-expect-error mock
    fs.existsSync.mockImplementation((filePath: string) =>
      filePath.includes(`${parentDir}/${LATITUDE_CONFIG_FILE}`),
    )

    expect(findRootDir()).toBe(parentDir)
  })

  it('should exit with error if latitude.json is not found within maxTries', () => {
    const currentDir = '/path/to/current/dir'
    const maxTries = 2
    process.cwd = vi.fn().mockReturnValue(currentDir)
    path.dirname = vi.fn().mockReturnValueOnce(currentDir)
    fs.existsSync = vi.fn().mockReturnValue(false)

    expect(() => findRootDir(maxTries)).toThrow()
  })
})
