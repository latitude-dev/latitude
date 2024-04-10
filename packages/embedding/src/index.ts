import {
  EmbeddingEvent,
  EventData,
  EmbeddingEventData,
  RunEventData,
  ParamsChangedEventData,
} from './types'
import IframeMessages from './iframe-messages'

function triggerEvent<T extends EmbeddingEvent>(type: T, data: EventData<T>) {
  document.dispatchEvent(new CustomEvent(type, { detail: { type, ...data } }))
}

export function runEmbedViewQuery(data: RunEventData) {
  triggerEvent(EmbeddingEvent.Run, data)
}

export function triggerCustomEvent(data: unknown) {
  triggerEvent(EmbeddingEvent.Custom, { data })
}

export function changeEmbedParams(params: ParamsChangedEventData) {
  triggerEvent(EmbeddingEvent.ParamsChanged, { params })
}

export const iframe = new IframeMessages()

// @ts-expect-error - isolatedModules is true and re-exporting the types is not allowed
export { EmbeddingEvent, EmbeddingEventData }
