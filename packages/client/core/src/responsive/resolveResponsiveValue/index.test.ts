import { describe, it, expect } from 'vitest'
import resolveResponsiveValue from '.'

describe('resolveResponsiveValue', () => {
  it('resolves when is a string for gap property', () => {
    expect(
      resolveResponsiveValue({ property: 'gap', value: 'xsmall' }),
    ).toEqual(['lat-gap-2'])
  })

  it('resolves when is a string for flexAlign property', () => {
    expect(
      resolveResponsiveValue({ property: 'flexAlign', value: 'left' }),
    ).toEqual(['lat-justify-start'])
  })

  it('resolves when is an object for gap property', () => {
    expect(
      resolveResponsiveValue({
        property: 'gap',
        value: {
          mobile: 'xsmall',
          desktop: 'large',
        },
      }),
    ).toEqual(['lat-gap-2', 'lg:lat-gap-8'])
  })

  it('resolves when is an array for gap property', () => {
    expect(
      resolveResponsiveValue({
        property: 'gap',
        value: ['xsmall', undefined, 'large']
      })

    ).toEqual(['lat-gap-2', 'lg:lat-gap-8'])

  })
})
