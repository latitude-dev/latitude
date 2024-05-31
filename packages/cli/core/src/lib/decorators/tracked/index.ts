import telemetry from '$src/lib/telemetry'
import { TelemetryEvent, TelemetryEventType } from '$src/lib/telemetry/events'

export default function tracked<T extends TelemetryEventType>(
  event: T,
  commandFn: Function,
) {
  return async function (...args: any[]) {
    await telemetry.track({ event } as TelemetryEvent<T>)

    return commandFn(...args)
  }
}
