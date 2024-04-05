import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import crypto from 'crypto'
import telemetry, { Telemetry } from './index'
import chalk from 'chalk'
import os from 'os'

const SELECT_ARGS = {
  message:
    '🌟 Help us make Latitude better for you by sharing anonymous usage data—it’s a simple way \n to contribute, with full control to opt-in or opt-out at any time.',
  default: true,
  choices: [
    { value: true, name: 'Yes, count me in!' },
    { value: false, name: 'No, maybe later' },
  ],
}

process.env['PACKAGE_VERSION'] = '1.0.0'
vi.spyOn(os, 'platform').mockImplementation(() => 'darwin')
vi.spyOn(os, 'release').mockImplementation(() => '20.6.0')
const mockedCrypto = vi
  .spyOn(crypto, 'randomBytes')
  .mockImplementation(() => ({ toString: () => 'mocked-random-user-id' }))

const mockedTrack = vi.hoisted(() => vi.fn())
const mockedIdentify = vi.hoisted(() => vi.fn())
const MockedRudderStack = vi.hoisted(() =>
  vi.fn().mockImplementation((_clientKey, _options) => {
    return {
      track: mockedTrack,
      identify: mockedIdentify,
    }
  }),
)
vi.mock('@rudderstack/rudder-sdk-node', () => ({
  default: MockedRudderStack,
}))

const mockedStoreGet = vi.hoisted(() => vi.fn())
const mockedStoreSet = vi.hoisted(() => vi.fn())
const MockedConfigStore = vi.hoisted(() =>
  vi.fn().mockImplementation((_pkgVersion, _options) => {
    return {
      set: mockedStoreSet,
      get: mockedStoreGet,
    }
  }),
)
vi.mock('configstore', () => ({ default: MockedConfigStore }))

const mockedSelect = vi.hoisted(() => vi.fn())
vi.mock('@inquirer/prompts', async () => {
  const original = await vi.importActual('@inquirer/prompts')
  return {
    ...original,
    select: mockedSelect,
  }
})

const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

describe('Telemetry', () => {
  beforeEach(() => {
    vi.stubEnv('TELEMETRY_CLIENT_KEY', 'secret-telemetry-key')
    vi.stubEnv('TELEMETRY_URL', 'telemetry-url')
    mockedStoreGet.mockReturnValue({
      enabled: undefined,
      anonymousUserId: undefined,
    })
  })

  afterEach(() => {
    consoleMock.mockReset()
    vi.unstubAllEnvs()
  })

  it('should create an instance', () => {
    expect(telemetry).toBeInstanceOf(Telemetry)
  })

  it('initialize rudderstack', () => {
    new Telemetry()
    expect(MockedRudderStack).toHaveBeenCalledWith('secret-telemetry-key', {
      dataPlaneUrl: 'telemetry-url',
    })
  })

  describe('#showStatus', () => {
    it('show status disabled', () => {
      mockedStoreGet.mockReturnValue(false)
      telemetry.showStatus()

      expect(consoleMock).toHaveBeenLastCalledWith(
        chalk.green('Telemetry is disabled'),
      )
    })

    it('show status enabled', () => {
      telemetry.showStatus()
      expect(consoleMock).toHaveBeenLastCalledWith(
        chalk.green('Telemetry is disabled'),
      )
    })
  })

  describe('#track', () => {
    beforeEach(() => {
      mockedSelect.mockClear()
    })

    afterEach(() => {
      mockedSelect.mockReset()
    })

    it('does not ask for permission if already initialized', async () => {
      telemetry['initialized'] = true
      await telemetry.track({ event: 'startCommand' })

      expect(mockedSelect).not.toHaveBeenCalled()
      telemetry['initialized'] = false
    })

    it('does not track the event if not enabled', async () => {
      mockedStoreGet.mockReturnValue({
        enabled: false,
        anonymousUserId: undefined,
      })
      await telemetry.track({ event: 'startCommand' })

      expect(mockedTrack).not.toHaveBeenCalled()
    })

    it('ask for permission when startCommand is invoked', async () => {
      await telemetry.track({ event: 'startCommand' })

      expect(mockedSelect).toHaveBeenCalledWith(SELECT_ARGS)
    })

    it('initialize config store', async () => {
      await telemetry.track({ event: 'startCommand' })
      expect(MockedConfigStore).toHaveBeenCalledWith(expect.any(String), {
        telemetry: {
          enabled: undefined,
          anonymousUserId: undefined,
        },
      })
    })

    describe('when telemetry permission is not granted', () => {
      beforeEach(() => {
        mockedSelect.mockResolvedValue(false)
      })

      it('identifies user', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedIdentify).toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          context: {
            telemetry: { enabled: false },
            cliVersion: '1.0.0',
            operatingSystem: {
              platform: 'darwin',
              version: '20.6.0',
            },
          },
        })
      })

      it('stores config', async () => {
        await telemetry.track({ event: 'startCommand' })
        expect(mockedStoreSet).toHaveBeenCalledWith('telemetry.enabled', false)
        expect(mockedStoreSet).toHaveBeenCalledWith(
          'telemetry.anonymousUserId',
          'mocked-random-user-id',
        )
      })

      it('tracks event', async () => {
        await telemetry.track({ event: 'startCommand' })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          event: 'telemetryDisabled',
          properties: undefined,
        })

        expect(mockedTrack).not.toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          event: 'startCommand',
          properties: undefined,
        })
      })
    })

    describe('when persimission is granted', () => {
      beforeEach(() => {
        mockedSelect.mockResolvedValue(true)
      })

      it('generates random identifier', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedCrypto).toHaveBeenCalledWith(16)
        expect(mockedStoreSet).toHaveBeenNthCalledWith(
          1,
          'telemetry.anonymousUserId',
          'mocked-random-user-id',
        )
      })

      it('identifies user', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedIdentify).toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          context: {
            telemetry: { enabled: true },
            cliVersion: '1.0.0',
            operatingSystem: {
              platform: 'darwin',
              version: '20.6.0',
            },
          },
        })
      })

      it('stores config', async () => {
        await telemetry.track({ event: 'startCommand' })
        expect(mockedStoreSet).toHaveBeenCalledWith('telemetry.enabled', true)
        expect(mockedStoreSet).toHaveBeenCalledWith(
          'telemetry.anonymousUserId',
          'mocked-random-user-id',
        )
      })

      it('tracks event', async () => {
        await telemetry.track({ event: 'startCommand' })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          event: 'telemetryEnabled',
          properties: undefined,
        })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: 'cli-mocked-random-user-id',
          event: 'startCommand',
          properties: undefined,
        })
      })
    })
  })
})
