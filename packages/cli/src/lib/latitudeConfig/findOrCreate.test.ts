import getLatestVersion from './getLatestVersion'
import findConfigFile from './findConfigFile'
import findOrCreateConfigFile from './findOrCreate' // Adjust with the correct path
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fsExtra from 'fs-extra'
import config from '$src/config'

// Mock the fsExtra module
vi.mock('fs-extra', () => {
  return {
    default: {
      readJsonSync: vi.fn(),
      writeJsonSync: vi.fn(),
    },
  }
})

vi.mock('./findConfigFile')
vi.mock('./getLatestVersion')
vi.mock('../getAppVersions', () => ({
  getLatestVersions: vi.fn(),
}))

describe('findOrCreateConfigFile', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
    // Setup default mock implementations here if applicable
  })

  it('should use existing version from config file when present', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: config.latitudeJsonPath,
      data: { version: '1.0.0', name: 'test-app' },
    }))

    const result = await findOrCreateConfigFile()

    expect(fsExtra.writeJsonSync).not.toHaveBeenCalled()
    expect(result).toEqual({
      path: config.latitudeJsonPath,
      data: { version: '1.0.0', name: 'test-app' },
    })
  })

  it('should fetch the latest version when version is not present in config file', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: config.latitudeJsonPath,
      data: { name: 'test-app' },
    }))

    // @ts-expect-error mock
    getLatestVersion.mockResolvedValue('1.2.3')

    const result = await findOrCreateConfigFile()

    expect(getLatestVersion).toHaveBeenCalled()
    expect(result).toBeTruthy()
    expect(fsExtra.writeJsonSync).toHaveBeenCalledWith(
      config.latitudeJsonPath,
      expect.objectContaining({ version: '1.2.3' }),
      { spaces: 2 },
    )
  })

  it('should process.exit with code 1 when version is not present in config file and getLatestVersion fails', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: config.latitudeJsonPath,
      data: { name: 'test-app' },
    }))

    // @ts-expect-error mock
    getLatestVersion.mockRejectedValue(
      new Error('Failed to fetch latest version'),
    )

    const spy = vi.spyOn(process, 'exit').mockImplementation(vi.fn())

    await findOrCreateConfigFile()

    expect(spy).toHaveBeenCalledWith(1)
  })
})
