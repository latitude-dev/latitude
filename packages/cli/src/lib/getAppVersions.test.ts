import { exec } from 'child_process'
import getLatitudeVersions from './getAppVersions'
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest'

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

describe('getAppVersions with next flag', () => {
  beforeAll(() => {
    // @ts-expect-error mock
    vi.mocked(exec).mockImplementation((command, callback) => {
      if (command.includes('--json')) {
        const versions = [
          '1.0.0',
          '1.1.0',
          '2.0.0-next.1',
          '2.0.0-next.2',
          '2.0.0',
        ]

        // @ts-expect-error mock
        callback(null, JSON.stringify(versions), null)
      } else {
        // @ts-expect-error mock
        callback(new Error('Error'), null, null)
      }
    })
  })

  afterAll(() => {
    vi.mocked(exec).mockRestore()
  })

  it('should return next releases when the next flag is set to true', async () => {
    const options = { next: true }
    const results = await getLatitudeVersions(options)

    const includesNextVersions = results.some((v) => v.includes('next'))

    expect(results).toBeInstanceOf(Array)
    expect(results.length).toBeGreaterThan(0)
    expect(includesNextVersions).toBe(true)
  })

  it('should filter out next releases when the next flag is set to false', async () => {
    const options = { next: false }
    const results = await getLatitudeVersions(options)

    const includesNextVersions = results.some((v) => v.includes('next'))

    expect(includesNextVersions).toBe(false)
  })
})
