import { newSpecPage } from '@stencil/core/testing'
import { LatitudeEmbed } from './latitude-embed'

describe('latitude-embed', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [LatitudeEmbed],
      html: '<latitude-embed></latitude-embed>',
    })
    expect(root).toEqualHtml(`
      <latitude-embed>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </latitude-embed>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [LatitudeEmbed],
      html: `<latitude-embed first="Stencil" last="'Don't call me a framework' JS"></latitude-embed>`,
    })
    expect(root).toEqualHtml(`
      <latitude-embed first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </latitude-embed>
    `)
  })
})
