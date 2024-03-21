import { sync, computeDiff } from '.'
import { describe, expect, it, vi } from 'vitest'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import spawn from '$src/lib/spawn'

vi.mock('fs')
vi.mock('$src/lib/spawn', () => ({
  default: vi.fn(),
}))

describe('sync', () => {
  it('successfully syncs dependencies when differences are present', () => {
    // @ts-expect-error mock
    existsSync.mockImplementationOnce((path: string) => {
      return path.includes('package.json')
    })

    readFileSync
      // @ts-expect-error mock
      .mockImplementation((path: string) => {
        if (path.endsWith('target/package.json')) {
          return JSON.stringify({ dependencies: {}, devDependencies: {} })
        }
        if (path.endsWith('root/package.json')) {
          return JSON.stringify({
            dependencies: { react: '^17.0.0' },
            devDependencies: {},
          })
        }
        throw new Error('File not found')
      })

    // @ts-expect-error mock
    writeFileSync.mockReset()
    // @ts-expect-error mock
    spawn.mockReset()

    sync({
      root: 'path/to/root/package.json',
      target: 'path/to/target/package.json',
    })()

    expect(writeFileSync).toHaveBeenCalled()
    expect(spawn).toHaveBeenCalled()
  })

  it('does not sync when dependencies are the same', () => {
    // @ts-expect-error mock
    existsSync.mockImplementation((path: string) => {
      return path.includes('package.json')
    })

    readFileSync
      // @ts-expect-error mock
      .mockImplementation((path: string) => {
        if (path.endsWith('target/package.json')) {
          return JSON.stringify({
            dependencies: { react: '^17.0.0' },
            devDependencies: {},
          })
        }

        if (path.endsWith('root/package.json')) {
          return JSON.stringify({
            dependencies: { react: '^17.0.0' },
            devDependencies: {},
          })
        }

        throw new Error('File not found')
      })

    // @ts-expect-error mock
    writeFileSync.mockReset()
    // @ts-expect-error mock
    spawn.mockReset()

    sync({
      root: 'path/to/root/package.json',
      target: 'path/to/target/package.json',
    })()

    expect(writeFileSync).not.toHaveBeenCalled()
    expect(spawn).not.toHaveBeenCalled()
  })

  it('does not sync if root package.json does not exist', () => {
    // @ts-expect-error mock
    existsSync.mockImplementation((path: string) => {
      return !path.includes('root/package.json')
    })

    // @ts-expect-error mock
    writeFileSync.mockReset()
    // @ts-expect-error mock
    spawn.mockReset()

    sync({
      root: 'path/to/root/package.json',
      target: 'path/to/target/package.json',
    })()

    expect(writeFileSync).not.toHaveBeenCalled()
    expect(spawn).not.toHaveBeenCalled()
  })
})

describe('computeDiff', () => {
  it('identifies differences correctly', () => {
    const rootDeps = {
      'test-lib': '^1.0.0',
      'another-lib': '^2.0.0',
    }

    const targetDeps = {
      'test-lib': '^1.0.0', // Same version
      'another-lib': '^3.0.0', // Different version
    }

    const expectedResult = [{ key: 'another-lib', value: '^2.0.0' }]

    expect(computeDiff(rootDeps, targetDeps)).toEqual(expectedResult)
  })

  it('returns an empty array when there are no differences', () => {
    const rootDeps = {
      'test-lib': '^1.0.0',
    }

    const targetDeps = {
      'test-lib': '^1.0.0',
    }

    expect(computeDiff(rootDeps, targetDeps)).toHaveLength(0)
  })
})
