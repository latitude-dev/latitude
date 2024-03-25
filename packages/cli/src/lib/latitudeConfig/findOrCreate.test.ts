import getLatestVersion from './getLatestVersion'
import findConfigFile from './findConfigFile'
import findOrCreateConfigFile from './findOrCreate' // Adjust with the correct path
import validate from './validate'
import { PackageManager, PackageManagerWithFlags } from '$src/config'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fsExtra from 'fs-extra'

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

vi.mock('./validate')

describe('findOrCreateConfigFile', () => {
  const appDir = '/test/app'
  const pkgManager: PackageManagerWithFlags = {
    command: PackageManager.npm,
    flags: {
      mandatoryInstallFlags: [],
      installFlags: { silent: '--silent' },
    },
  }
  const configPath = `${appDir}/config.json`

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
    // Setup default mock implementations here if applicable
  })

  it('should use existing version from config file when present', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: configPath,
      data: { version: '1.0.0', name: 'test-app' },
    }))
    // @ts-expect-error mock
    validate.mockReturnValue({ valid: true })

    const result = await findOrCreateConfigFile({ appDir, pkgManager })

    expect(result).toBeTruthy()
    expect(fsExtra.writeJsonSync).toHaveBeenCalledWith(
      configPath,
      expect.objectContaining({ version: '1.0.0' }),
      { spaces: 2 },
    )
  })

  it('should fetch the latest version when version is not present in config file', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: configPath,
      data: { name: 'test-app' },
    }))

    // @ts-expect-error mock
    getLatestVersion.mockResolvedValue('1.2.3')
    // @ts-expect-error mock
    validate.mockReturnValue({ valid: true })

    const result = await findOrCreateConfigFile({ appDir, pkgManager })

    expect(getLatestVersion).toHaveBeenCalledWith(pkgManager)
    expect(result).toBeTruthy()
    expect(fsExtra.writeJsonSync).toHaveBeenCalledWith(
      configPath,
      expect.objectContaining({ version: '1.2.3' }),
      { spaces: 2 },
    )
  })

  it('should process.exit with code 1 when version is not present in config file and getLatestVersion fails', async () => {
    // @ts-expect-error mock
    findConfigFile.mockImplementation(() => ({
      path: configPath,
      data: { name: 'test-app' },
    }))

    // @ts-expect-error mock
    getLatestVersion.mockRejectedValue(
      new Error('Failed to fetch latest version'),
    )

    const spy = vi.spyOn(process, 'exit').mockImplementation(vi.fn())

    await findOrCreateConfigFile({ appDir, pkgManager })

    expect(spy).toHaveBeenCalledWith(1)
  })
})
