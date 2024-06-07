import { describe, it, expect } from 'vitest'

import { properties as all } from './index'
import classGenerator from './classGenerator'

describe('classGenerator', () => {
  it.only('generates tailwind responsive classes', () => {
    const properties = { flexAlign: all.flexAlign, marginLeft: all.marginLeft }
    expect(
      classGenerator({ properties, propsWithNegatives: ['marginLeft'] }),
    ).toEqual(
      [
        'lat-justify-start md:lat-justify-start lg:lat-justify-start xl:lat-justify-start 2xl:lat-justify-start',
        'lat-justify-center md:lat-justify-center lg:lat-justify-center xl:lat-justify-center 2xl:lat-justify-center',
        'lat-justify-end md:lat-justify-end lg:lat-justify-end xl:lat-justify-end 2xl:lat-justify-end',
        '-lat-ml-0 lat-ml-0 md:-lat-ml-0 md:lat-ml-0 lg:-lat-ml-0 lg:lat-ml-0 xl:-lat-ml-0 xl:lat-ml-0 2xl:-lat-ml-0 2xl:lat-ml-0',
        '-lat-ml-1 lat-ml-1 md:-lat-ml-1 md:lat-ml-1 lg:-lat-ml-1 lg:lat-ml-1 xl:-lat-ml-1 xl:lat-ml-1 2xl:-lat-ml-1 2xl:lat-ml-1',
        '-lat-ml-2 lat-ml-2 md:-lat-ml-2 md:lat-ml-2 lg:-lat-ml-2 lg:lat-ml-2 xl:-lat-ml-2 xl:lat-ml-2 2xl:-lat-ml-2 2xl:lat-ml-2',
        '-lat-ml-3 lat-ml-3 md:-lat-ml-3 md:lat-ml-3 lg:-lat-ml-3 lg:lat-ml-3 xl:-lat-ml-3 xl:lat-ml-3 2xl:-lat-ml-3 2xl:lat-ml-3',
        '-lat-ml-5 lat-ml-5 md:-lat-ml-5 md:lat-ml-5 lg:-lat-ml-5 lg:lat-ml-5 xl:-lat-ml-5 xl:lat-ml-5 2xl:-lat-ml-5 2xl:lat-ml-5',
        '-lat-ml-6 lat-ml-6 md:-lat-ml-6 md:lat-ml-6 lg:-lat-ml-6 lg:lat-ml-6 xl:-lat-ml-6 xl:lat-ml-6 2xl:-lat-ml-6 2xl:lat-ml-6',
        '-lat-ml-8 lat-ml-8 md:-lat-ml-8 md:lat-ml-8 lg:-lat-ml-8 lg:lat-ml-8 xl:-lat-ml-8 xl:lat-ml-8 2xl:-lat-ml-8 2xl:lat-ml-8',
        '-lat-ml-12 lat-ml-12 md:-lat-ml-12 md:lat-ml-12 lg:-lat-ml-12 lg:lat-ml-12 xl:-lat-ml-12 xl:lat-ml-12 2xl:-lat-ml-12 2xl:lat-ml-12',
        '-lat-ml-24 lat-ml-24 md:-lat-ml-24 md:lat-ml-24 lg:-lat-ml-24 lg:lat-ml-24 xl:-lat-ml-24 xl:lat-ml-24 2xl:-lat-ml-24 2xl:lat-ml-24',
        '-lat-ml-32 lat-ml-32 md:-lat-ml-32 md:lat-ml-32 lg:-lat-ml-32 lg:lat-ml-32 xl:-lat-ml-32 xl:lat-ml-32 2xl:-lat-ml-32 2xl:lat-ml-32',
      ].join(' '),
    )
  })
})
