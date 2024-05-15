import { beforeEach, describe, expect, it, vi } from 'vitest'
import syncFiles from './syncFiles' // Adjust the import path accordingly
import * as fs from 'fs'
import colors from 'picocolors'
import output from '$src/lib/output'

// Mocking necessary modules
vi.mock('fs')
vi.mock('path')
vi.mock('$src/lib/output', () => ({
  default: vi.fn(),
}))
vi.mock('picocolors', () => ({
  default: {
    red: vi.fn((msg) => msg), // Minimal mocking for readability
  },
}))

describe('syncFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('successfully adds a file', async () => {
    // Assuming the function isn't inherently async; adjust if necessary.
    syncFiles({
      srcPath: '/path/to/source/file.txt',
      relativePath: 'file.txt',
      destPath: '/path/to/dest/file.txt',
      type: 'add',
      ready: true,
    })

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      '/path/to/source/file.txt',
      '/path/to/dest/file.txt',
    )
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
    expect(output).not.toHaveBeenCalled()
  })

  it('handles error when adding a file and directory cannot be created', () => {
    const error = new Error('Mock directory creation error')
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
      throw error
    })
    syncFiles({
      srcPath: '/path/to/source/file.txt',
      relativePath: 'file.txt',
      destPath: '/path/to/dest/file.txt',
      type: 'add',
      ready: true,
    })

    expect(output).toHaveBeenCalledWith(
      colors.red(`/path/to/dest could not be created: ${error.message}`),
      true,
    )
  })

  it('successfully changes a file', () => {
    syncFiles({
      srcPath: '/path/to/source/modified-file.txt',
      relativePath: 'modified-file.txt',
      destPath: '/path/to/dest/modified-file.txt',
      type: 'change',
      ready: true,
    })

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      '/path/to/source/modified-file.txt',
      '/path/to/dest/modified-file.txt',
    )
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
    expect(output).not.toHaveBeenCalled()
  })

  it('handles error when changing a file and file cannot be copied', () => {
    const error = new Error('Mock copy error')
    vi.spyOn(fs, 'copyFileSync').mockImplementation(() => {
      throw error
    })

    syncFiles({
      srcPath: '/path/to/source/modified-file.txt',
      relativePath: 'modified-file.txt',
      destPath: '/path/to/dest/modified-file.txt',
      type: 'change',
      ready: true,
    })

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      '/path/to/source/modified-file.txt',
      '/path/to/dest/modified-file.txt',
    )
    expect(output).toHaveBeenCalledWith(
      colors.red(
        `modified-file.txt could not be symlinked to /path/to/dest/modified-file.txt: ${error}`,
      ),
      true,
    )
  })
  it('successfully unlinks (deletes) a file', () => {
    syncFiles({
      srcPath: '', // srcPath is irrelevant in the unlink operation
      relativePath: 'file-to-delete.txt',
      destPath: '/path/to/dest/file-to-delete.txt',
      type: 'unlink',
      ready: true,
    })

    expect(fs.unlink).toHaveBeenCalledWith(
      '/path/to/dest/file-to-delete.txt',
      expect.any(Function),
    )
  })

  it('handles error when unlinking a file fails', () => {
    const error = new Error('Mock unlink error')
    vi.spyOn(fs, 'unlink').mockImplementation((_, callback) => {
      callback(error)
    })

    syncFiles({
      srcPath: '', // srcPath is irrelevant for unlink
      relativePath: 'file-to-delete.txt',
      destPath: '/path/to/dest/file-to-delete.txt',
      type: 'unlink',
      ready: true,
    })

    expect(fs.unlink).toHaveBeenCalledWith(
      '/path/to/dest/file-to-delete.txt',
      expect.any(Function),
    )
    expect(output).toHaveBeenCalledWith(
      colors.red(
        `/path/to/dest/file-to-delete.txt could not be deleted: ${error}`,
      ),
      true,
    )
  })
})
