import { describe, it, expect } from 'vitest'
import { betaRow } from './index'

describe('rowClass', () => {
  it('generates spacing classes', () => {
    expect(betaRow({ space: 'gutter' })).toEqual({
      childSpaceClasses: ['lat-pl-6'],
      marginLeftClasses: ['-lat-ml-6'],
    })
  })

  it('generates responsive spacing classes', () => {
    expect(betaRow({ space: ['small', 'gutter'] })).toEqual({
      childSpaceClasses: ['lat-pl-3', 'md:lat-pl-6'],
      marginLeftClasses: ['-lat-ml-3', 'md:-lat-ml-6'],
    })
  })

  it('generates responsive spacing classes with collapse below tablet', () => {
    expect(
      betaRow({ space: ['small', 'gutter'], collapseBelow: 'tablet' }),
    ).toEqual({
      marginLeftClasses: ['lg:-lat-ml-6'],
      childSpaceClasses: ['lat-pt-3', 'md:lat-pt-6', 'lg:lat-pl-6'],
    })
  })
})
