import { describe, it, expect } from 'vitest'
import { cssClasses as box } from './index'

const BASE = 'lat-flex lat-flex-row'

describe('box', () => {
  it('return default box', () => {
    expect(box()).toEqual(`${BASE} lat-bg-transparent`)
  })

  it('return box with custom background color', () => {
    expect(box({ backgroundColor: 'primary' })).toEqual(
      `${BASE} lat-bg-primary`,
    )
  })

  it('change flex direction (string)', () => {
    expect(box({ direction: 'columnReverse' })).toEqual(
      'lat-flex lat-flex-col-reverse lat-bg-transparent',
    )
  })

  it('change flex direction on desktop (array)', () => {
    expect(box({ direction: ['row', undefined, 'column'] })).toEqual(
      `${BASE} lg:lat-flex-col lat-bg-transparent`,
    )
  })

  it('change flex direction on desktop (object)', () => {
    expect(box({ direction: { mobile: 'row', desktop: 'column' } })).toEqual(
      `${BASE} lg:lat-flex-col lat-bg-transparent`,
    )
  })

  it('support all these properties', () => {
    expect(
      box({
        display: 'flex',
        direction: 'column',
        alignX: 'center',
        alignY: 'center',
        position: 'relative',
        gap: 'small',
        gapY: 'large',
        gapX: 'xsmall',
        margin: 'medium',
        marginLeft: 'small',
        marginRight: 'large',
        marginTop: 'xsmall',
        marginBottom: 'xlarge',
        padding: 'medium',
        paddingLeft: ['small', 'large'],
        paddingRight: 'large',
        paddingTop: 'xsmall',
        paddingBottom: 'xlarge',
      }),
    ).toEqual(
      [
        'lat-flex lat-justify-center lat-items-center lat-flex-col',
        'lat-relative lat-gap-3 lat-gap-y-8 lat-gap-x-2',
        'lat-m-5 lat-ml-3 lat-mr-8 lat-mt-2 lat-mb-12',
        'lat-p-5 lat-pl-3 md:lat-pl-8 lat-pr-8 lat-pt-2 lat-pb-12',
        'lat-bg-transparent',
      ].join(' '),
    )
  })
})
