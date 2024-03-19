import { sync, computeDiff } from '.'
import { describe, expect, it, vi } from 'vitest'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import spawn from '$src/lib/spawn'

vi.mock('fs')
vi.mock('$src/lib/spawn', () => ({
  default: vi.fn(),
}))

describe('sync', () => {
  async function runSyncTest(
    rootContents: Record<string, unknown>,
    targetContents: Record<string, unknown>,
  ) {
    // @ts-expect-error mock
    existsSync.mockImplementation((path: string) => {
      return path.includes('package.json')
    })
    readFileSync
      // @ts-expect-error mock
      .mockImplementation((path: string) => {
        if (path.endsWith('target/package.json')) {
          return JSON.stringify(targetContents)
        }
        if (path.endsWith('root/package.json')) {
          return JSON.stringify(rootContents)
        }
        throw new Error('File not found')
      })

    // @ts-expect-error mock
    writeFileSync.mockClear()
    // @ts-expect-error mock
    spawn.mockClear()

    sync({
      root: 'path/to/root/package.json',
      target: 'path/to/target/package.json',
      defaultDependencies: {}, // Assume these are obtained correctly
      defaultDevDependencies: {},
    })()
  }

  it('successfully syncs dependencies when differences are present', async () => {
    runSyncTest(
      { dependencies: { react: '^17.0.0' }, devDependencies: {} },
      { dependencies: {}, devDependencies: {} },
    )

    expect(writeFileSync).toHaveBeenCalled()
    expect(spawn).toHaveBeenCalled()
  })

  it('does not sync when dependencies are the same', async () => {
    runSyncTest(
      { dependencies: { react: '^17.0.0' }, devDependencies: {} },
      { dependencies: { react: '^17.0.0' }, devDependencies: {} },
    )

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
