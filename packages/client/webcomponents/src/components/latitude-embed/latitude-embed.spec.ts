import { newSpecPage } from '@stencil/core/testing'
import { LatitudeEmbed } from './latitude-embed'

describe('latitude-embed', () => {
  it('renders an iframe', async () => {
    const { root } = await newSpecPage({
      components: [LatitudeEmbed],
      html: '<latitude-embed class="h-full"></latitude-embed>',
    })
    expect(root).toEqualHtml(`
      <latitude-embed class="h-full">
        <mock:shadow-root>
          <iframe>
          </iframe>
        </mock:shadow-root>
      </latitude-embed>
    `)
  })

  it('renders the iframe URL with the right params', async () => {
    const page = await newSpecPage({
      components: [LatitudeEmbed],
      html: `
        <latitude-embed url="https://latitude.test-hack-init"></latitude-embed>
      `,
    })

    // Test are done with webcomponents. So is not possible to
    // pass object as props directly. Instead, we need to set the
    // property of the instance.
    const { root, rootInstance: component } = page
    component.params = { hello: 'world' }
    component.url = 'https://latitude.test'
    await page.waitForChanges()

    // NOTE: URL + params are updated only when the component is loaded
    // We need to check the iframe src because URL only change whe url is changed
    // because we don't want to re-render the iframe every time the params change
    const iframe = root.shadowRoot.querySelector('iframe')
    expect(iframe.getAttribute('src')).toBe('https://latitude.test?hello=world')
  })

  it('renders signedParams as part of the iframe URL', async () => {
    const page = await newSpecPage({
      components: [LatitudeEmbed],
      html: `
        <latitude-embed url="https://latitude.test-hack-init"></latitude-embed>
      `,
    })

    const { root, rootInstance: component } = page
    component.params = { hello: 'world' }
    component.signedParams = 'ENCRYPTED_PARAMS'
    component.url = 'https://latitude.test'
    await page.waitForChanges()

    const iframe = root.shadowRoot.querySelector('iframe')
    expect(iframe.getAttribute('src')).toBe(
      'https://latitude.test?__token=ENCRYPTED_PARAMS&hello=world',
    )
  })
})
