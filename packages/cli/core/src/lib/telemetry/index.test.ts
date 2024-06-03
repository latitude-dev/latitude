import os from 'os'
import { Telemetry } from './index'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

process.env['PACKAGE_VERSION'] = '1.0.0'
process.env.TELEMETRY_CLIENT_KEY = 'mocked-client-key'
process.env.TELEMETRY_URL = 'mocked-url'

vi.spyOn(os, 'platform').mockImplementation(() => 'darwin')
vi.spyOn(os, 'release').mockImplementation(() => '20.6.0')

const mockedTrack = vi.hoisted(() => vi.fn())
const mockedIdentify = vi.hoisted(() => vi.fn())
const mockedRudderStack = vi.hoisted(() =>
  vi.fn().mockImplementation((_clientKey, _options) => {
    return {
      track: mockedTrack,
      identify: mockedIdentify,
    }
  }),
)
vi.mock('@rudderstack/rudder-sdk-node', () => ({ default: mockedRudderStack }))

const mockedSelect = vi.hoisted(() => vi.fn())
vi.mock('@inquirer/prompts', async () => {
  const original = await vi.importActual('@inquirer/prompts')
  return {
    ...original,
    select: mockedSelect,
  }
})

const mockedConfig = vi.hoisted(() => ({
  dev: true,
  tty: true,
}))
vi.mock('$src/config', () => ({
  default: mockedConfig,
}))

const mockedStoreSet = vi.hoisted(() => vi.fn())
const mockedStoreGet = vi.hoisted(() => vi.fn())
vi.mock('$src/lib/configStore', () => ({
  default: {
    set: mockedStoreSet,
    get: mockedStoreGet,
  },
}))

describe('Telemetry', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('#track', () => {
    it('does not track the event if not enabled', async () => {
      mockedStoreGet.mockImplementationOnce((key) => {
        if (key === 'telemetry.enabled') return false
        return undefined
      })

      const instance = new Telemetry()
      await instance.track({ event: 'startCommand' })

      expect(mockedTrack).not.toHaveBeenCalled()
    })

    it('ask for permission when startCommand is invoked', async () => {
      mockedStoreGet.mockImplementationOnce((key) => {
        if (key === 'telemetry.enabled') return undefined
      })

      const instance = new Telemetry()
      await instance.track({ event: 'startCommand' })

      expect(mockedSelect).toHaveBeenCalled()
    })

    it('does not ask for permission when startCommand is invoked and permission is already granted', async () => {
      mockedStoreGet.mockImplementationOnce((key) => {
        if (key === 'telemetry.enabled') return true
      })

      const instance = new Telemetry()
      await instance.track({ event: 'startCommand' })

      expect(mockedSelect).not.toHaveBeenCalled()
    })

    describe('when telemetry permission is not granted', () => {
      beforeEach(() => {
        mockedSelect.mockResolvedValue(false)
        mockedStoreGet.mockReturnValueOnce(undefined).mockReturnValue(false)
      })

      it('emits a telemetrydisabled event', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: expect.any(String),
          event: 'telemetryDisabled',
          properties: undefined,
        })
      })

      it('identifies user', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedIdentify).toHaveBeenCalled()
      })

      it('stores config', async () => {
        const telemetry = new Telemetry()
        await telemetry.track({ event: 'startCommand' })
        expect(mockedStoreSet).toHaveBeenCalledWith('telemetry.enabled', false)
        expect(mockedStoreSet).toHaveBeenCalledWith(
          'telemetry.anonymousUserId',
          expect.any(String),
        )
      })

      it('tracks event', async () => {
        const telemetry = new Telemetry()
        await telemetry.track({ event: 'startCommand' })

        expect(mockedTrack).not.toHaveBeenCalledWith({
          anonymousId: expect.any(String),
          event: 'startCommand',
          properties: undefined,
        })
      })
    })

    describe('when persimission is granted', () => {
      beforeEach(() => {
        mockedSelect.mockResolvedValue(true)
        mockedStoreGet.mockReturnValueOnce(undefined).mockReturnValue(true)
      })

      it('emits a telemetryenabled event', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: expect.any(String),
          event: 'telemetryEnabled',
          properties: undefined,
        })
      })

      it('generates random identifier', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedStoreSet).toHaveBeenCalledWith(
          'telemetry.anonymousUserId',
          expect.any(String),
        )
      })

      it('identifies user', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedIdentify).toHaveBeenCalledWith({
          anonymousId: expect.any(String),
          context: {
            cliVersion: '1.0.0',
            operatingSystem: {
              platform: 'darwin',
              version: '20.6.0',
            },
            telemetry: {
              enabled: true,
            },
          },
        })
      })

      it('stores config', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedStoreSet).toHaveBeenCalledWith('telemetry.enabled', true)
        expect(mockedStoreSet).toHaveBeenCalledWith(
          'telemetry.anonymousUserId',
          expect.any(String),
        )
      })

      it('tracks event', async () => {
        const instance = new Telemetry()
        await instance.track({ event: 'startCommand' })

        expect(mockedTrack).toHaveBeenCalledWith({
          anonymousId: expect.any(String),
          event: 'startCommand',
          properties: undefined,
        })
      })
    })

    describe('when tty is disabled', () => {
      beforeEach(() => {
        mockedConfig.tty = false
      })

      it('does not ask for permission when startCommand is invoked', async () => {
        mockedStoreGet.mockImplementationOnce((key) => {
          if (key === 'telemetry.enabled') return undefined
        })

        const telemetry = new Telemetry()
        await telemetry.track({ event: 'startCommand' })

        expect(mockedSelect).not.toHaveBeenCalled()
        expect(mockedTrack).not.toHaveBeenCalled()
      })
    })
  })
})
