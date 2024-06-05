import { describe, it, expect } from 'vitest'

import { properties as all } from './index'
import classGenerator from './classGenerator'

describe('classGenerator', () => {
  it('generates tailwind responsive classes', () => {
    const properties = { flexAlign: all.flexAlign, gap: all.gap }
    expect(classGenerator({ properties })).toEqual(
      [
        'justify-start md:justify-start lg:justify-start xl:justify-start 2xl:justify-start',
        'justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center',
        'justify-end md:justify-end lg:justify-end xl:justify-end 2xl:justify-end',
        'gap-0 md:gap-0 lg:gap-0 xl:gap-0 2xl:gap-0',
        'gap-1 md:gap-1 lg:gap-1 xl:gap-1 2xl:gap-1',
        'gap-2 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2',
        'gap-3 md:gap-3 lg:gap-3 xl:gap-3 2xl:gap-3',
        'gap-5 md:gap-5 lg:gap-5 xl:gap-5 2xl:gap-5',
        'gap-6 md:gap-6 lg:gap-6 xl:gap-6 2xl:gap-6',
        'gap-8 md:gap-8 lg:gap-8 xl:gap-8 2xl:gap-8',
        'gap-12 md:gap-12 lg:gap-12 xl:gap-12 2xl:gap-12',
        'gap-24 md:gap-24 lg:gap-24 xl:gap-24 2xl:gap-24',
        'gap-32 md:gap-32 lg:gap-32 xl:gap-32 2xl:gap-32',
      ].join(' ')
    )
  })
})
