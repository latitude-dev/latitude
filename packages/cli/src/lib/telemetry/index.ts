import RudderAnalytics from "@rudderstack/rudder-sdk-node"
import os from 'os'
import crypto from 'crypto'
import Configstore from 'configstore';
import { select } from '@inquirer/prompts'

import type { TelemetryEvent, TelemetryEventType } from './events'
import { readFileSync } from "fs";
import boxedMessage from "../boxedMessage";
const CLIENT_KEY = '2daExoSEzxW3lPbRFQVoYIGh0Rb'
const ANALYTICS_URL = 'https://latitudecmggvg.dataplane.rudderstack.com'

type TelemetryConfig = {
  enabled: boolean | undefined
  anonymousUserId: string | undefined
}

const NOT_CONFIGURED: TelemetryConfig = {
  enabled: undefined,
  anonymousUserId: undefined,
}

class Telemetry {
  private static instance: Telemetry
  private client: RudderAnalytics
  private configStore: Configstore
  private initialized: boolean = false

  public static getInstance(): Telemetry {
    if (Telemetry.instance) return this.instance

    this.instance = new Telemetry()
    return this.instance
  }

  constructor() {
    this.client = new RudderAnalytics(CLIENT_KEY, { dataPlaneUrl: ANALYTICS_URL })
    const cliPkg = this.cliPkg
    this.configStore = new Configstore(cliPkg.name, { telemetry: NOT_CONFIGURED })
  }

  showStatus() {
    boxedMessage({
      color: 'green',
      title: 'Telemetry ',
      text: `Telemetry is ${this.enabled ? 'enabled' : 'disabled'}`,
    })
  }

  async track<T extends TelemetryEventType>(event: TelemetryEvent<T>) {
    const canTrack = await this.setup()
    if (!canTrack) return

    this.client.track({
      anonymousId: this.anonymousId,
      event: event.event,
      properties: event.properties
    })
  }

  enable() {
    this.track({ event: 'telemetryEnabled' })
    this.configStore.set('telemetry.enabled', true);
  }

  disable() {
    this.track({ event: 'telemetryDisabled' })
    this.configStore.set('telemetry.enabled', false);
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
      enabled = await select<boolean>(
        {
          message: '🌟 Help us make Latitude better for you by sharing anonymous usage data—it’s a simple way \n to contribute, with full control to opt-in or opt-out at any time.',
          default: true,
          choices: [
            { value: true, name: 'Yes, count me in!' },
            { value: false, name: 'No, maybe later' },
          ],
        }
      )
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
        cliVersion: this.cliPkg.version,
        operatingSystem: {
          platform: os.platform(),
          version: os.release(),
        }
      }
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
    this.configStore.set('telemetry.anonymousUserId', anonymousUserId)

    return anonymousUserId
  }

  private get config(): TelemetryConfig {
    return this.configStore.get('telemetry')
  }

  private get cliPkg() {
    const packageJsonText = readFileSync(new URL('../package.json', import.meta.url))
    const pkg = JSON.parse(packageJsonText.toString())
    return {
      name: pkg.name,
      version: pkg.version
    }
  }
}

export default Telemetry.getInstance()
