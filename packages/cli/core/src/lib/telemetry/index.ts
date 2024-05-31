import RudderAnalytics from '@rudderstack/rudder-sdk-node'
import config from '$src/config'
import configStore from '$src/lib/configStore'
import crypto from 'crypto'
import os from 'os'
import { select } from '@inquirer/prompts'

import type { TelemetryEvent, TelemetryEventType } from './events'

type TelemetryCredentials = {
  clientKey: string
  clientUrl: string
}

export class Telemetry {
  public readonly client

  public get enabled() {
    return configStore.get('telemetry.enabled')
  }

  public set enabled(value: boolean) {
    configStore.set('telemetry.enabled', value)
  }

  public get anonymousId() {
    return `cli-${configStore.get('telemetry.anonymousUserId')}`
  }

  public set anonymousId(value: string) {
    configStore.set('telemetry.anonymousUserId', value)
  }

  constructor() {
    if (!this.credentials) return

    this.client = new RudderAnalytics(this.credentials.clientKey, {
      dataPlaneUrl: this.credentials.clientUrl,
    })
  }

  async track<T extends TelemetryEventType>(event: TelemetryEvent<T>) {
    if (await this.canTrack()) {
      this._track(event)
    }
  }

  private async canTrack() {
    if (this.enabled === undefined) return await this.askPermission()

    return this.enabled
  }

  private async askPermission() {
    if (!config.tty) return false

    const enabled = await select<boolean>({
      message:
        '🌟 Help us make Latitude better for you by sharing anonymous usage data—it’s a simple way \n to contribute, with full control to opt-in or opt-out at any time.',
      default: true,
      choices: [
        { value: true, name: 'Yes, count me in!' },
        { value: false, name: 'No, maybe later' },
      ],
    })

    if (enabled) {
      this._track({ event: 'telemetryEnabled' })
    } else {
      this._track({ event: 'telemetryDisabled' })
    }

    this.enabled = enabled
    this.anonymousId = `${crypto.randomBytes(16).toString('hex')}`
    this.identifyAnonymous()

    return enabled
  }

  private async _track<T extends TelemetryEventType>(event: TelemetryEvent<T>) {
    this.client?.track({
      anonymousId: this.anonymousId,
      event: event.event,
      properties: event.properties,
    })
  }

  private identifyAnonymous() {
    this.client?.identify({
      anonymousId: this.anonymousId,
      context: {
        telemetry: { enabled: this.enabled },
        cliVersion: process.env.PACKAGE_VERSION,
        operatingSystem: {
          platform: os.platform(),
          version: os.release(),
        },
      },
    })
  }

  private get credentials(): TelemetryCredentials | undefined {
    const clientKey = process.env.TELEMETRY_CLIENT_KEY
    const clientUrl = process.env.TELEMETRY_URL
    if (!clientKey || !clientUrl) return undefined

    return {
      clientKey,
      clientUrl,
    }
  }
}

export default new Telemetry()
