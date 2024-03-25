import RudderAnalytics from '@rudderstack/rudder-sdk-node'
import configStore from '../configStore'
import crypto from 'crypto'
import os from 'os'
import { select } from '@inquirer/prompts'

import type { TelemetryEvent, TelemetryEventType } from './events'
import chalk from 'chalk'

const CLIENT_KEY = '2daExoSEzxW3lPbRFQVoYIGh0Rb'
const ANALYTICS_URL = 'https://latitudecmggvg.dataplane.rudderstack.com'

type TelemetryConfig = {
  enabled: boolean | undefined
  anonymousUserId: string | undefined
}

class Telemetry {
  private static instance: Telemetry
  private client: RudderAnalytics
  private initialized: boolean = false

  public static getInstance(): Telemetry {
    if (Telemetry.instance) return this.instance

    this.instance = new Telemetry()
    return this.instance
  }

  constructor() {
    this.client = new RudderAnalytics(CLIENT_KEY, {
      dataPlaneUrl: ANALYTICS_URL,
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

    this.client.track({
      anonymousId: this.anonymousId,
      event: event.event,
      properties: event.properties,
    })
  }

  enable() {
    this.track({ event: 'telemetryEnabled' })
    configStore.set('telemetry.enabled', true)
  }

  disable() {
    this.track({ event: 'telemetryDisabled' })
    configStore.set('telemetry.enabled', false)
  }

  private async setup() {
    // Only do this one time one running the CLI
    if (this.initialized) return this.enabled

    if (this.enabled !== undefined) {
      this.initialized = true
      return this.enabled
    }

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

  private identifyAnonymous(enabled: boolean) {
    this.client.identify({
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

  // Private methods

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
}

export default Telemetry.getInstance()
