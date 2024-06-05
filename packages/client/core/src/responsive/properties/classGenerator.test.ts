import { describe, it, expect } from 'vitest'

import { properties as all } from './index'
import classGenerator from './classGenerator'

describe('classGenerator', () => {
  it('generates tailwind responsive classes', () => {
    const properties = { flexAlign: all.flexAlign, gap: all.gap }
    expect(classGenerator({ properties })).toEqual(
      [
        'lat-justify-start md:lat-justify-start lg:lat-justify-start xl:lat-justify-start 2xl:lat-justify-start',
        'lat-justify-center md:lat-justify-center lg:lat-justify-center xl:lat-justify-center 2xl:lat-justify-center',
        'lat-justify-end md:lat-justify-end lg:lat-justify-end xl:lat-justify-end 2xl:lat-justify-end',
        'lat-gap-0 md:lat-gap-0 lg:lat-gap-0 xl:lat-gap-0 2xl:lat-gap-0',
        'lat-gap-1 md:lat-gap-1 lg:lat-gap-1 xl:lat-gap-1 2xl:lat-gap-1',
        'lat-gap-2 md:lat-gap-2 lg:lat-gap-2 xl:lat-gap-2 2xl:lat-gap-2',
        'lat-gap-3 md:lat-gap-3 lg:lat-gap-3 xl:lat-gap-3 2xl:lat-gap-3',
        'lat-gap-5 md:lat-gap-5 lg:lat-gap-5 xl:lat-gap-5 2xl:lat-gap-5',
        'lat-gap-6 md:lat-gap-6 lg:lat-gap-6 xl:lat-gap-6 2xl:lat-gap-6',
        'lat-gap-8 md:lat-gap-8 lg:lat-gap-8 xl:lat-gap-8 2xl:lat-gap-8',
        'lat-gap-12 md:lat-gap-12 lg:lat-gap-12 xl:lat-gap-12 2xl:lat-gap-12',
        'lat-gap-24 md:lat-gap-24 lg:lat-gap-24 xl:lat-gap-24 2xl:lat-gap-24',
        'lat-gap-32 md:lat-gap-32 lg:lat-gap-32 xl:lat-gap-32 2xl:lat-gap-32',
      ].join(' ')
    )
  })
})
