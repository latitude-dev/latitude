import { Component, Prop, h } from '@stencil/core'
import { format } from '../../utils/utils'

@Component({
  tag: 'latitude-embed',
  styleUrl: 'latitude-embed.css',
  shadow: true,
})
export class LatitudeEmbed {
  @Prop() first: string
  @Prop() middle: string
  @Prop() last: string

  private getText(): string {
    return format(this.first, this.middle, this.last)
  }

  render() {
    return <div>Hello, World! I'm {this.getText()}</div>
  }
}
