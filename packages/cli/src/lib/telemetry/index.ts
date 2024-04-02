import RudderAnalytics from '@rudderstack/rudder-sdk-node'
import crypto from 'crypto'
import os from 'os'
import { select } from '@inquirer/prompts'

import type { TelemetryEvent, TelemetryEventType } from './events'
import chalk from 'chalk'
import configStore from '$src/lib/configStore'

const CLIENT_KEY = '2daExoSEzxW3lPbRFQVoYIGh0Rb'
const ANALYTICS_URL = 'https://latitudecmggvg.dataplane.rudderstack.com'
type TelemetryConfig = {
  enabled: boolean | undefined
  anonymousUserId: string | undefined
}

type TelemetryCredentials = {
  clientKey: string
  clientUrl: string
}
export class Telemetry {
  private static instance: Telemetry
  private client: RudderAnalytics | undefined = undefined
  private initialized: boolean = false

  public static getInstance(): Telemetry {
    if (Telemetry.instance) return this.instance

    this.instance = new Telemetry()
    return this.instance
  }

  constructor() {
    if (!this.credentials) return

    this.client = new RudderAnalytics(this.credentials.clientKey, {
      dataPlaneUrl: this.credentials.clientUrl,
    })
  }

  showStatus() {
    console.log(
      chalk.green(`Telemetry is ${this.enabled ? 'enabled' : 'disabled'}`),
    )
  }

  async track<T extends TelemetryEventType>(event: TelemetryEvent<T>) {
    const canTrack = await this.setup()

    if (!canTrack) return

    this.trackWithoutCheck(event)
  }

  enable() {
    this.trackWithoutCheck({ event: 'telemetryEnabled' })
    configStore.set('telemetry.enabled', true)
  }

  disable() {
    this.trackWithoutCheck({ event: 'telemetryDisabled' })
    configStore.set('telemetry.enabled', false)
  }

  private async setup() {
    if (this.initialized) return this.enabled
    if (this.enabled !== undefined) return this.enabled

    let enabled = false
    try {
      enabled = await select<boolean>({
        message:
          '🌟 Help us make Latitude better for you by sharing anonymous usage data—it’s a simple way \n to contribute, with full control to opt-in or opt-out at any time.',
        default: true,
        choices: [
          { value: true, name: 'Yes, count me in!' },
          { value: false, name: 'No, maybe later' },
        ],
      })
    } catch {
      // Ignore Ctrl+C
    }

    this.identifyAnonymous(enabled)

    if (enabled) {
      this.enable()
    } else {
      this.disable()
    }

    this.initialized = true

    return enabled
  }

  async trackWithoutCheck<T extends TelemetryEventType>(
    event: TelemetryEvent<T>,
  ) {
    this.client?.track({
      anonymousId: this.anonymousId,
      event: event.event,
      properties: event.properties,
    })
  }

  private identifyAnonymous(enabled: boolean) {
    this.client?.identify({
      anonymousId: this.anonymousId,
      context: {
        telemetry: { enabled },
        cliVersion: process.env.PACKAGE_VERSION,
        operatingSystem: {
          platform: os.platform(),
          version: os.release(),
        },
      },
    })
  }

  private get enabled() {
    return this.config.enabled
  }

  private get anonymousId() {
    return `cli-${this.randomUserId}`
  }

  private get randomUserId(): string | undefined {
    if (this.config.anonymousUserId) return this.config.anonymousUserId

    const anonymousUserId = crypto.randomBytes(16).toString('hex')
    configStore.set('telemetry.anonymousUserId', anonymousUserId)

    return anonymousUserId
  }

  private get config(): TelemetryConfig {
    return configStore.get('telemetry')
  }

  // TODO: Provision TELEMETRY_CLIENT_KEY and TELEMETRY_URL
  // We don't want to use telemetry in development mode
  // we will provision this for the published CLI
  private get credentials(): TelemetryCredentials | undefined {
    const clientKey = process.env.TELEMETRY_CLIENT_KEY ?? CLIENT_KEY
    const clientUrl = process.env.TELEMETRY_URL ?? ANALYTICS_URL
    if (!clientKey || !clientUrl) return undefined

    return {
      clientKey,
      clientUrl,
    }
  }
}

export default Telemetry.getInstance()
