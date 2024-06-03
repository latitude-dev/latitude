import config from '$src/config'
import path from 'path'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { existsSync } from 'fs'
import { manageDependencies } from './_shared'
import npmInstall from '../npm/install'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}))
vi.mock('path', () => ({
  default: {
    join: vi.fn(),
  },
}))
vi.mock('../npm/install', () => ({
  default: vi.fn(),
}))
vi.mock('$src/config', () => ({
  default: {
    rootDir: vi.fn(),
  },
}))

describe('manageDependencies with isUpdate=false', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('does nothing when node_modules and package.json exist', async () => {
    const mockRootDir = '/path/to/root'
    vi.mocked(config).rootDir = mockRootDir

    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(path.join).mockReturnValue(mockRootDir)

    const npmInstallMock = vi.mocked(npmInstall)
    npmInstallMock.mockImplementation(({ handlers }) => handlers.onClose?.(0))

    await manageDependencies({ root: true, isUpdate: false })

    expect(path.join).toHaveBeenCalledWith(mockRootDir, 'package.json')
    expect(path.join).toHaveBeenCalledWith(mockRootDir, 'node_modules')
    expect(existsSync).toHaveBeenCalledTimes(2)
    expect(npmInstallMock).not.toHaveBeenCalled()
  })

  it('attempts to install when node_modules is not found at root', async () => {
    const mockRootDir = '/path/to/root'
    vi.mocked(config).rootDir = mockRootDir

    vi.mocked(existsSync).mockReturnValueOnce(true).mockReturnValueOnce(false)
    vi.mocked(path.join).mockReturnValue(mockRootDir)

    const npmInstallMock = vi.mocked(npmInstall)
    npmInstallMock.mockImplementation(({ handlers }) => handlers.onClose?.(0))

    await manageDependencies({ root: true, isUpdate: false })

    expect(path.join).toHaveBeenCalledWith(mockRootDir, 'package.json')
    expect(path.join).toHaveBeenCalledWith(mockRootDir, 'node_modules')
    expect(existsSync).toHaveBeenCalledTimes(2)
    expect(npmInstallMock).toHaveBeenCalledTimes(1)
  })

  it('does nothing when package.json does not exist', () => {
    const mockRootDir = '/path/to/root'
    vi.mocked(config).rootDir = mockRootDir

    vi.mocked(existsSync).mockReturnValue(false)
    vi.mocked(path.join).mockReturnValue(mockRootDir)

    const spy = vi.spyOn(console, 'log')

    manageDependencies({ root: true, isUpdate: false })

    expect(spy).not.toHaveBeenCalled()
    expect(path.join).toHaveBeenCalledWith(mockRootDir, 'package.json')
    expect(existsSync).toHaveBeenCalledTimes(1)
  })
})
