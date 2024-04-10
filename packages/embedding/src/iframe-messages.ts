import {
  EmbeddingEvent,
  EmbeddingEventData,
  ParamsChangedEventData,
} from './types'

type MessageHandlerFn<T extends EmbeddingEvent> = (
  data: EmbeddingEventData<T>,
) => void

export default class IframeMessages {
  allowedOrigins: string[] = []
  private _onRun: MessageHandlerFn<EmbeddingEvent.Run> | undefined
  private _onParamsChanged:
    | MessageHandlerFn<EmbeddingEvent.ParamsChanged>
    | undefined
  private _onCustomEvent: MessageHandlerFn<EmbeddingEvent.Custom> | undefined

  registerAllowedOrigins(allowedOrigings: string[]) {
    // Avoid re-registering the allowed origins
    if (this.allowedOrigins.length > 0) return

    this.allowedOrigins = allowedOrigings
  }

  set onRun(handler: MessageHandlerFn<EmbeddingEvent.Run>) {
    if (this._onRun) return

    this._onRun = handler
  }

  set onParamsChanged(handler: MessageHandlerFn<EmbeddingEvent.ParamsChanged>) {
    if (this._onParamsChanged) return

    this._onParamsChanged = handler
  }

  set onCustomEvent(handler: MessageHandlerFn<EmbeddingEvent.Custom>) {
    if (this._onCustomEvent) return

    this._onCustomEvent = handler
  }

  listen() {
    window.addEventListener('message', (event) => {
      if (!this.validOrigin(event.origin)) return

      const type = event.data.type
      if (!type) return

      switch (type) {
        case EmbeddingEvent.Run:
          this._onRun?.(event.data)
          break
        case EmbeddingEvent.ParamsChanged:
          this._onParamsChanged?.(event.data)
          break
        case EmbeddingEvent.Custom:
          this._onCustomEvent?.(event.data)
          break
      }
    })
  }

  sendParamsChanged(params: ParamsChangedEventData) {
    this.send({ type: EmbeddingEvent.ParamsChanged, params })
  }

  private send<T extends EmbeddingEvent>(data: EmbeddingEventData<T>) {
    parent.postMessage(data, { targetOrigin: '*' })
  }

  private validOrigin(origin: string) {
    if (this.isUnprotected) return true

    return this.allowedOrigins.includes(origin)
  }

  private get isUnprotected() {
    return this.allowedOrigins.includes('*')
  }
}
