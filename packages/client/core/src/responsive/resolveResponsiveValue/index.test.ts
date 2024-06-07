import { describe, it, expect } from 'vitest'
import resolveResponsiveValue from '.'

describe('resolveResponsiveValue', () => {
  it('resolves when property is undefined', () => {
    expect(
      resolveResponsiveValue({ property: 'display', value: undefined }),
    ).toEqual([])
  })

  it('resolves when is a string for marginLeft property', () => {
    expect(
      resolveResponsiveValue({ property: 'marginLeft', value: 'xsmall' }),
    ).toEqual(['lat-ml-2'])
  })

  it('resolves when is a string for flexAlign property', () => {
    expect(
      resolveResponsiveValue({ property: 'flexAlign', value: 'left' }),
    ).toEqual(['lat-justify-start'])
  })

  it('resolves when is an object', () => {
    expect(
      resolveResponsiveValue({
        property: 'marginLeft',
        value: {
          mobile: 'xsmall',
          desktop: 'large',
        },
      }),
    ).toEqual(['lat-ml-2', 'lg:lat-ml-8'])
  })

  it('resolves when is an array', () => {
    expect(
      resolveResponsiveValue({
        property: 'marginLeft',
        value: ['xsmall', undefined, 'large']
      })

    ).toEqual(['lat-ml-2', 'lg:lat-ml-8'])

  })

  it('resolves when is an array negative', () => {
    expect(
      resolveResponsiveValue({
        property: 'marginLeft',
        value: ['xsmall', undefined, 'large'],
        generateNegative: true
      })

    ).toEqual(['-lat-ml-2', 'lg:-lat-ml-8'])

  })
})
