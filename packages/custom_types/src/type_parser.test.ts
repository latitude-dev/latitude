import { describe, it, expect } from 'vitest'
import { format, formatAll, parse, parseFromUrl } from '.' // Update the import path as necessary
import { RichDate, RelativeDate } from '.' // Ensure the RichDate class is correctly imported

describe('format', () => {
  it('formats null values correctly', () => {
    expect(format(null)).toBe('$null')
  })

  it('formats text correctly', () => {
    const text = 'Hello, world!'
    expect(format(text)).toBe(`$text:${encodeURIComponent(text)}`)
  })

  it('formats numbers correctly', () => {
    const number = 123.45
    expect(format(number)).toBe(`$num:${number}`)
  })

  it('formats boolean values correctly', () => {
    expect(format(true)).toBe('$bool:true')
    expect(format(false)).toBe('$bool:false')
  })

  it('formats Date objects correctly', () => {
    const date = new Date('2023-01-01')
    const richDate = new RichDate(date)
    expect(format(date)).toBe(
      `$date:${encodeURIComponent(richDate.toString())}`,
    )
  })

  it('formats RichDate objects correctly', () => {
    const absoluteDate = new RichDate(new Date('2023-01-01'))
    const relativeDate = new RichDate(RelativeDate.Today)
    expect(format(absoluteDate)).toBe(
      `$date:${encodeURIComponent(absoluteDate.toString())}`,
    )
    expect(format(relativeDate)).toBe(
      `$date:${encodeURIComponent(relativeDate.toString())}`,
    )
  })

  it('encode non-special types as URI components', () => {
    const object = { key: 'value' }
    expect(format(object)).toBe(encodeURIComponent(object.toString()))
  })
})

describe('parse', () => {
  it('parses null values correctly', () => {
    expect(parse('$null')).toBeNull()
  })

  it('parses text correctly', () => {
    const text = 'Hello, world!'
    expect(parse(`$text:${encodeURIComponent(text)}`)).toBe(text)
  })

  it('parses numbers correctly', () => {
    const number = 123.45
    expect(parse(`$num:${number}`)).toBe(number)
  })

  it('parses boolean values correctly', () => {
    expect(parse('$bool:true')).toBe(true)
    expect(parse('$bool:false')).toBe(false)
  })

  it('parses Date objects correctly', () => {
    const dateString = '2023-01-01'
    const format = 'yyyy-MM-dd'
    const absoluteDate = RichDate.fromString(dateString, format)
    const relativeDate = RichDate.fromString(RelativeDate.Today, format)
    expect(
      parse(
        `$date:${encodeURIComponent(dateString)}:${encodeURIComponent(format)}`,
      ),
    ).toEqual(absoluteDate)
    expect(
      parse(
        `$date:${encodeURIComponent(RelativeDate.Today)}:${encodeURIComponent(
          format,
        )}`,
      ),
    ).toEqual(relativeDate)
  })

  it('return the original string if the prefix is not recognized or not present', () => {
    const invalidString = '$unknown:value'
    const noPrefix = 'no-prefix'
    expect(parse(invalidString)).toBe(decodeURIComponent(invalidString))
    expect(parse(noPrefix)).toBe(decodeURIComponent(noPrefix))
  })

  it('decode URI components for unhandled types', () => {
    const encodedString = encodeURIComponent('Some encoded string')
    expect(parse(encodedString)).toBe('Some encoded string')
  })
})

describe('formatAll', () => {
  it('formats all values correctly', () => {
    const params = {
      foo: 'bar',
      baz: [1, 2, 3],
      qux: ['foo', 'bar', 'baz'],
      date: new RichDate(new Date('2023-01-01')),
      relativeDate: new RichDate(RelativeDate.Today),
    }
    expect(formatAll(params)).toBe(
      'foo=$text:bar&baz[]=$num:1&baz[]=$num:2&baz[]=$num:3&qux[]=$text:foo&qux[]=$text:bar&qux[]=$text:baz&date=$date:2023-01-01&relativeDate=$date:_TODAY_',
    )
  })
})

describe('parseFromUrl', () => {
  it('parses all values correctly', () => {
    const params =
      'foo=bar&baz[]=$num:1&baz[]=$num:2&baz[]=$num:3&qux[]=$text:foo&qux[]=$text:bar&qux[]=$text:baz&date=$date:2023-01-01&relativeDate=$date:_TODAY_'
    expect(parseFromUrl(params)).toEqual({
      foo: 'bar',
      baz: [1, 2, 3],
      qux: ['foo', 'bar', 'baz'],
      date: new RichDate(new Date('2023-01-01')),
      relativeDate: new RichDate(RelativeDate.Today),
    })
  })
})
