import {
  EventEmitter,
  Component,
  Prop,
  State,
  h,
  Watch,
  Listen,
  Event,
  Element,
} from '@stencil/core'
import {
  EmbeddingEvent,
  type EmbeddingEventData,
} from '@latitude-data/embedding'

@Component({
  tag: 'latitude-embed',
  styleUrl: 'latitude-embed.css',
  shadow: true,
})
export class LatitudeEmbed {
  // Mutable needed to change the value of the prop
  // when unit testing the component
  @Prop({ mutable: true }) url!: string
  @Prop({ mutable: true }) params: Record<string, string>
  @Prop({ mutable: true }) signedParams: string
  @State() iframeSrc: string
  @State() queryOrigin: string
  @Element() rootEl: HTMLElement
  @Event() paramsChanged: EventEmitter<
    EmbeddingEventData<EmbeddingEvent.ParamsChanged>
  >

  componentWillLoad() {
    this.buildIframeData()
  }

  componentDidLoad() {
    window.addEventListener('message', this.handleMessage)
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleMessage)
  }

  @Watch('url')
  queryChanged() {
    // We don't want to re-render the iframe every time the
    // params change. We only want to re-render the iframe
    // when the query or signupParam change.
    this.buildIframeData()
  }

  @Watch('signedParams')
  signedParamsChanged() {
    // We don't want to re-render the iframe every time the
    // params change. We only want to re-render the iframe
    // when the query or signupParam change.
    this.buildIframeData()
  }

  @Listen('latitude-run', { target: 'document' })
  runHandler(event: CustomEvent<EmbeddingEventData<EmbeddingEvent.Run>>) {
    this.iframe.contentWindow.postMessage(event.detail, {
      targetOrigin: this.queryOrigin,
    })
  }

  @Listen('latitude-change-param-request', { target: 'document' })
  paramsChangedHander(
    event: CustomEvent<EmbeddingEventData<EmbeddingEvent.ChangeParamRequest>>,
  ) {
    this.iframe.contentWindow.postMessage(event.detail, {
      targetOrigin: this.queryOrigin,
    })
  }

  @Listen('latitude-custom', { target: 'document' })
  customEventHander(
    event: CustomEvent<EmbeddingEventData<EmbeddingEvent.Run>>,
  ) {
    this.iframe.contentWindow.postMessage(event.detail, {
      targetOrigin: this.queryOrigin,
    })
  }

  private get iframe() {
    return this.rootEl.shadowRoot.querySelector('iframe')
  }

  private buildIframeData() {
    const queryParams = this.params ?? {}
    const params = this.signedParams
      ? { __token: this.signedParams, ...queryParams }
      : queryParams

    const urlParams = new URLSearchParams(params)
    this.iframeSrc = this.url ? `${this.url}?${urlParams.toString()}` : null

    this.queryOrigin = this.buildQueryOrigin()
  }

  private buildQueryOrigin() {
    if (!this.url) return ''

    const url = new URL(this.url)
    return url.origin
  }

  private handleMessage = <T extends EmbeddingEvent>(
    event: MessageEvent<EmbeddingEventData<T>>,
  ) => {
    if (event.source !== this.iframe.contentWindow) return

    const type = event.data.type

    switch (type) {
      case 'latitude-params-changed':
        this.paramsChanged.emit(event.data)
        break
      default:
    }
  }

  render() {
    return <iframe src={this.iframeSrc}></iframe>
  }
}
