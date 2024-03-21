import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { describe, it, expect, vi, afterEach } from 'vitest'
import * as syncDotenvModule from '$src/lib/sync/syncDotenv'
import { createMasterKey, MASTER_KEY_NAME } from './createMasterKey'
import { CLIConfig } from '$src/config'

vi.mock('fs')
vi.mock('path')
vi.mock('crypto')
vi.mock('$src/lib/sync/syncDotenv')
const mockCLIConfig = vi.fn(() => ({
  source: '/mock/source/path',
}))
vi.mock('$src/config', () => {
  return {
    CLIConfig: {
      getInstance: () => mockCLIConfig,
    },
  }
})

const config = CLIConfig.getInstance()
const MOCK_SECRET = 'mock-secret-value'
const mockCrypto = {
  randomBytes: vi.fn().mockReturnValue({ toString: () => MOCK_SECRET }),
}

const mockedSyncDotenv = { syncDotenv: vi.fn() }
const mockedWriteFileSync = vi.fn()
vi.mocked(crypto).randomBytes.mockImplementation(mockCrypto.randomBytes)
vi.mocked(syncDotenvModule).default.mockImplementation(
  mockedSyncDotenv.syncDotenv,
)
vi.mocked(fs).writeFileSync.mockImplementation(mockedWriteFileSync)

describe('createMasterKey', () => {
  afterEach(() => {
    mockCrypto.randomBytes.mockClear()
    mockedWriteFileSync.mockClear()
    mockedSyncDotenv.syncDotenv.mockClear()
  })
  it('creates .env file and secret key', () => {
    vi.mocked(fs).existsSync.mockReturnValue(false)

    const secret = createMasterKey({ config })

    expect(mockCrypto.randomBytes).toHaveBeenCalledWith(64)
    expect(secret).toBe(MOCK_SECRET)
    expect(mockedWriteFileSync).toHaveBeenCalledWith(
      path.join(config.source, '.env'),
      expect.stringContaining(`${MASTER_KEY_NAME}=${MOCK_SECRET}`),
      'utf8',
    )
    expect(mockedSyncDotenv.syncDotenv).toHaveBeenCalledWith({ config })
  })

  it('creates secret key with existing .env', () => {
    vi.mocked(fs).existsSync.mockReturnValue(true)
    vi.mocked(fs).readFileSync.mockReturnValue(`# This is a comment`)

    const secret = createMasterKey({ config })

    expect(mockCrypto.randomBytes).toHaveBeenCalledWith(64)
    expect(secret).toBe(MOCK_SECRET)
    expect(mockedWriteFileSync).toHaveBeenCalledWith(
      path.join(config.source, '.env'),
      expect.stringContaining(
        `# This is a comment\n${MASTER_KEY_NAME}=${MOCK_SECRET}`,
      ),
      'utf8',
    )
    expect(mockedSyncDotenv.syncDotenv).toHaveBeenCalledWith({
      config: mockCLIConfig,
    })
  })

  it('does not overwrite the existing key when not requested', () => {
    const existingSecret = 'existing-secret'
    vi.mocked(fs).existsSync.mockReturnValue(true)
    vi.mocked(fs).readFileSync.mockReturnValue(
      `${MASTER_KEY_NAME}=${existingSecret}\n`,
    )

    const secret = createMasterKey({ config })

    expect(mockCrypto.randomBytes).not.toHaveBeenCalled()
    expect(secret).toBe(existingSecret)
    expect(mockedWriteFileSync).not.toHaveBeenCalled()
    expect(mockedSyncDotenv.syncDotenv).not.toHaveBeenCalled()
  })

  it('overwrite the existing key when requested', () => {
    vi.mocked(fs).existsSync.mockReturnValue(true)
    vi.mocked(fs).readFileSync.mockReturnValue(`
HELLO=from.env.dot.file
# ${MASTER_KEY_NAME}=I_WANT_TO_KEEP_THIS_COMMENTED_SECRET
# This is a commend in my .env file
SOME_VALUE=123
${MASTER_KEY_NAME}=existing-secret
SOME_OTHER_VALUE=456`)

    createMasterKey({ config, overwriteKey: true })
    expect(mockedWriteFileSync).toHaveBeenCalledWith(
      path.join(config.source, '.env'),
      expect.stringContaining(`
HELLO=from.env.dot.file
# ${MASTER_KEY_NAME}=I_WANT_TO_KEEP_THIS_COMMENTED_SECRET
# This is a commend in my .env file
SOME_VALUE=123
${MASTER_KEY_NAME}=${MOCK_SECRET}
SOME_OTHER_VALUE=456`),
'utf8',
    )
  })
})
