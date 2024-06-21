import { describe, it, expect, vi, beforeEach } from 'vitest'
import ensureConnectorInstalled from './ensureConnectorInstalled'
import isConfigFile from '$src/lib/isConfigFile'

// Mock external dependencies
vi.mock('fs')
vi.mock('picocolors', () => ({
  default: {
    yellow: vi.fn((text) => `yellow: ${text}`),
    cyan: vi.fn((text) => `cyan: ${text}`),
  },
}))
vi.mock('$src/config', () => ({
  default: { rootDir: '/mockedPath', queriesDir: '/mockedQueriesDir' },
}))
const clearAllMock = vi.hoisted(vi.fn)
const clearMock = vi.hoisted(vi.fn)
const loadFromConfigFileMock = vi.hoisted(vi.fn)
const sourceManagerMock = vi.hoisted(() =>
  vi.fn(() => ({
    clearAll: clearAllMock,
    clear: clearMock,
    loadFromConfigFile: loadFromConfigFileMock,
  })),
)
vi.mock('@latitude-data/source-manager', () => {
  return {
    SourceManager: sourceManagerMock,
  }
})
vi.mock('$src/lib/isConfigFile', () => ({ default: vi.fn() }))

describe('ensureConnectorInstalled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loadFromConfigFileMock.mockResolvedValue({
      connectorPackageName: 'mocked-package',
    })
    vi.mocked(isConfigFile).mockImplementation(() => true)
  })

  it('should return immediately if not a source file', async () => {
    vi.mocked(isConfigFile).mockImplementation(() => false)

    const result = await ensureConnectorInstalled('path/to/file', 'add')

    expect(result).toBeUndefined()
    expect(clearMock).not.toHaveBeenCalled()
  })

  it('should handle source unlink', async () => {
    await ensureConnectorInstalled('path/to/source', 'unlink')

    expect(clearMock).toHaveBeenCalledTimes(1)
  })

  it('should attempt to reload config on source change', async () => {
    // Pretend a valid loadFromConfigFile response to observe reload behavior
    loadFromConfigFileMock
      .mockResolvedValueOnce({ connectorPackageName: 'mocked-package' })
      .mockResolvedValueOnce({ connectorPackageName: 'new-mocked-package' })

    await ensureConnectorInstalled('path/to/source', 'change')

    expect(clearMock).toHaveBeenCalledTimes(1)
    expect(loadFromConfigFileMock).toHaveBeenCalledTimes(2)
  })

  it('logs an error message if the source file cannot be read', async () => {
    // Simulate an error when trying to read the source file configuration
    vi.mocked(loadFromConfigFileMock).mockRejectedValue(
      new Error('Failed to read source file'),
    )

    const consoleSpy = vi.spyOn(console, 'log')

    await ensureConnectorInstalled('path/to/unreadable/source', 'add')

    // Assert that the correct error message is logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Could not read source file at .../to/unreadable/source. Failed to read source file',
      ),
    )

    consoleSpy.mockRestore()
  })
})
