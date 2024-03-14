import type { apiObject } from '@rudderstack/rudder-sdk-node'
export type TelemetryEventType =
  | 'startCommand'
  | 'devCommand'
  | 'buildCommand'
  | 'prepareCommand'
  | 'runCommand'
  | 'updateCommand'
  | 'telemetryCommand'
  | 'deployCommand'
  | 'telemetryEnabled'
  | 'telemetryDisabled'

type BaseEvent<T extends TelemetryEventType> = {
  event: T
  properties?: apiObject
}

type UpdatePayload = BaseEvent<'updateCommand'> & {
  properties: {
    fixingVersion: boolean
    oldVersion: string
    newVersion: string
  }
}

export type TelemetryEvent<T extends TelemetryEventType> =
  T extends 'updateCommand' ? UpdatePayload : BaseEvent<T>
