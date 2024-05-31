import { describe, it, expect, vi } from 'vitest'
import { Dirent, readdirSync } from 'fs'
import { syncDirectory } from '.'

// Mocking path.join to return a predictable output
vi.mock('path', () => {
  return {
    default: {
      join: (...args: string[]) => args.join('/'),
    },
  }
})

vi.mock('fs', () => ({
  readdirSync: vi.fn(),
}))

describe('syncDirectory', () => {
  it('should sync all files in the given directory', () => {
    const mockFiles = [
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'file2.txt', isDirectory: () => false },
    ]

    // Mocking readdirSync to return mockFiles
    vi.mocked(readdirSync).mockReturnValue(mockFiles as unknown as Dirent[])

    // Mock implementation
    const mockSyncFn = vi.fn()

    syncDirectory('testDir', mockSyncFn)

    expect(mockSyncFn).toHaveBeenCalledTimes(2)
    expect(mockSyncFn).toHaveBeenNthCalledWith(
      1,
      'testDir/file1.txt',
      'add',
      true,
    )
    expect(mockSyncFn).toHaveBeenNthCalledWith(
      2,
      'testDir/file2.txt',
      'add',
      true,
    )
  })

  it('should recursively sync all files in nested directories', () => {
    const mockFilesNested = [
      { name: 'nestedDir', isDirectory: () => true },
      { name: 'file1.txt', isDirectory: () => false },
    ]
    const mockNestedFiles = [{ name: 'file2.txt', isDirectory: () => false }]

    // @ts-expect-error - mock
    vi.mocked(readdirSync).mockImplementation((dirPath: string) => {
      if (dirPath.includes('nestedDir')) return mockNestedFiles
      return mockFilesNested
    })

    // Mock implementation
    const mockSyncFn = vi.fn()

    syncDirectory('testDir', mockSyncFn)

    expect(mockSyncFn).toHaveBeenCalledTimes(2)
    expect(mockSyncFn).toHaveBeenNthCalledWith(
      1,
      'testDir/nestedDir/file2.txt',
      'add',
      true,
    )
    expect(mockSyncFn).toHaveBeenNthCalledWith(
      2,
      'testDir/file1.txt',
      'add',
      true,
    )
  })
})
