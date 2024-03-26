import { exec } from 'child_process'
import getLatitudeVersions from './getAppVersions'
import { vi, describe, it, expect } from 'vitest'

vi.mock('child_process', async (importOriginal) => {
  const actual = (await importOriginal()) as unknown as Object

  return {
    ...actual,
    exec: vi.fn((_, callback) => {
      callback(null, JSON.stringify(['1.1.1']), null)
    }),
  }
})

describe('getAppVersions', () => {
  it('should return a list of semver versions', async () => {
    const results = await getLatitudeVersions()

    expect(results).toBeInstanceOf(Array)
    expect(results.length).toBeGreaterThan(0)
  })

  it('should throw if the node exec command fails with an error', () => {
    // @ts-expect-error mock
    exec.mockImplementation((_, callback) => {
      callback(new Error('Error'), null, null)
    })

    expect(getLatitudeVersions()).rejects.toThrow('Error')
  })

  it('should not throw if the node exec command outputs to stderr but contains no Error', () => {
    // @ts-expect-error mock
    exec.mockImplementation((_, callback) => {
      callback(null, null, 'Error')
    })

    expect(getLatitudeVersions()).resolves.toBeDefined()
  })
})
