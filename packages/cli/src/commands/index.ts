import build from './build'
import dev from './dev'
import prepare from './prepare'
import start from './start'
import update from './update'
import telemetry from './telemetry'
import setupDecorator from '../lib/decorators/setup'
import trackedDecorator from '../lib/decorators/tracked'
import { TelemetryEventType } from '../lib/telemetry/events'
import { onError } from '../utils'
import run from './run'
import versionCheck from '$src/lib/decorators/versionCheck'
import credentials from '$src/commands/credentials'

export type Options = {
  tracked?: boolean
  setup?: boolean
}

export default function command(
  event: TelemetryEventType,
  { tracked = true, setup = true }: Options = { tracked: true, setup: true },
) {
  let commandFn
  switch (event) {
    case 'devCommand':
      commandFn = dev
      break
    case 'buildCommand':
      commandFn = build
      break
    case 'prepareCommand':
      commandFn = prepare
      break
    case 'startCommand':
      commandFn = start
      break
    case 'updateCommand':
      commandFn = update
      break
    case 'telemetryCommand':
      commandFn = telemetry
      break
    case 'runCommand':
      commandFn = run
      break
    case 'credentialsCommand':
      commandFn = credentials
      break
    default:
      onError({
        message: `Command not found: ${event}`,
      })

      process.exit(1)
  }

  if (tracked) commandFn = trackedDecorator(event, commandFn)
  if (setup) commandFn = setupDecorator(commandFn)
  commandFn = versionCheck(commandFn)

  return commandFn
}
