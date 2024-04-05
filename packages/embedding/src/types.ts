export enum EmbeddingEvent {
  Run = 'latitude-run',
  ParamsChanged = 'latitude-params-changed',
  Custom = 'latitude-custom',
}

export type RunEventData = {
  queryPaths: string[]
  force?: boolean
  skipIfParamsEqual?: boolean
}

export type ParamsChangedEventData = { [key: string]: unknown }

export type EventData<T extends EmbeddingEvent> = Omit<
  EmbeddingEventData<T>,
  'type'
>
export type EmbeddingEventData<T extends EmbeddingEvent> =
  T extends EmbeddingEvent.Run
    ? { type: T } & RunEventData
    : T extends EmbeddingEvent.ParamsChanged
      ? { type: T; params: ParamsChangedEventData }
      : T extends EmbeddingEvent.Custom
        ? { type: T; data: unknown }
        : never
