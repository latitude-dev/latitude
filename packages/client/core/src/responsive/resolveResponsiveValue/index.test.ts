import { describe, it, expect } from 'vitest'
import resolveResponsiveValue from '.'

describe('resolveResponsiveValue', () => {
  /* it('resolve when is a string', () => { */
  /*   expect( */
  /*     resolveResponsiveValue({ property: 'gap', value: 'xsmall' }), */
  /*   ).toEqual(['gap-2']) */
  /* }) */

  it('resolve when is an object', () => {
    expect(
      resolveResponsiveValue({
        property: 'gap',
        value: {
          mobile: 'xsmall',
          desktop: 'large',
        },
      }),
    ).toEqual(['gap-2', 'lg:gap-8'])
  })
})
