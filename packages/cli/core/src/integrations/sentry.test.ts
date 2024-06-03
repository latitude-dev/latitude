import { describe, it, expect, vi, afterEach } from 'vitest'
import initSentry from './sentry'

const mockedSentryInit = vi.hoisted(() => vi.fn())
vi.mock('@sentry/node', async () => {
  const original = await vi.importActual('@sentry/node')
  return {
    ...original,
    init: mockedSentryInit,
  }
})

describe('initSentry', () => {
  afterEach(() => {
    mockedSentryInit.mockRestore()
    vi.unstubAllEnvs()
  })

  it('uses Sentry', () => {
    vi.stubEnv('CLI_SENTRY_ENABLED', 'true')
    vi.stubEnv('CLI_SENTRY_DSN', 'your-sentry-dsn-url')
    initSentry()
    expect(mockedSentryInit).toHaveBeenCalledWith({
      dsn: 'your-sentry-dsn-url',
    })
  })

  it('does not uses Sentry', () => {
    vi.stubEnv('CLI_SENTRY_ENABLED', '')
    vi.stubEnv('CLI_SENTRY_DSN', '')
    initSentry()
    expect(mockedSentryInit).not.toHaveBeenCalled()
  })
})
