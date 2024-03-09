import { describe, it, expect } from 'vitest'
import { format } from 'date-fns/format'
import { RichDate, RelativeDate } from '.'

describe('RichDate', () => {
  describe('constructor', () => {
    it('default to current date with default format', () => {
      const richDate = new RichDate()
      expect(richDate.toString()).toBe(
        new Date().toISOString().slice(0, 10), // Assuming default format is 'yyyy-MM-dd'
      )
    })

    it('accepts custom date and format', () => {
      const customDate = new Date(2020, 0, 1)
      const customFormat = 'dd/MM/yyyy'
      const richDate = new RichDate(customDate, customFormat)
      expect(richDate.toString()).toBe('01/01/2020')
    })

    it('accepts relative dates', () => {
      const richDateToday = new RichDate(RelativeDate.Today)
      expect(richDateToday.toString()).toBe(RelativeDate.Today)

      const richDateYesterday = new RichDate(RelativeDate.Yesterday)
      expect(richDateYesterday.toString()).toBe(RelativeDate.Yesterday)

      const richDateTomorrow = new RichDate(RelativeDate.Tomorrow)
      expect(richDateTomorrow.toString()).toBe(RelativeDate.Tomorrow)
    })
  })

  describe('fromString', () => {
    it('parses date from string with default format', () => {
      const formattedDate = '2020-01-01'
      const richDate = RichDate.fromString(formattedDate)
      expect(richDate.toString()).toBe(formattedDate)
    })

    it('parses date from string with custom format', () => {
      const formattedDate = '01/01/2020'
      const customFormat = 'dd/MM/yyyy'
      const richDate = RichDate.fromString(formattedDate, customFormat)
      expect(richDate.toString()).toBe(formattedDate)
    })

    it('handles relative dates', () => {
      const richDateToday = RichDate.fromString(RelativeDate.Today)
      expect(richDateToday.toString()).toBe(RelativeDate.Today)

      const richDateYesterday = RichDate.fromString(RelativeDate.Yesterday)
      expect(richDateYesterday.toString()).toBe(RelativeDate.Yesterday)

      const richDateTomorrow = RichDate.fromString(RelativeDate.Tomorrow)
      expect(richDateTomorrow.toString()).toBe(RelativeDate.Tomorrow)
    })
  })

  describe('isRelative', () => {
    it('returns true for relative dates', () => {
      const richDateToday = new RichDate(RelativeDate.Today)
      expect(richDateToday.isRelative()).toBe(true)
    })

    it('returns false for specific dates', () => {
      const richDate = new RichDate(new Date())
      expect(richDate.isRelative()).toBe(false)
    })
  })

  describe('toString', () => {
    it('returns formatted string for specific dates', () => {
      const customDate = new Date(2020, 0, 1)
      const customFormat = 'dd/MM/yyyy'
      const richDate = new RichDate(customDate, customFormat)
      expect(richDate.toString()).toBe('01/01/2020')
    })

    it('returns relative date string for relative dates', () => {
      const richDateToday = new RichDate(RelativeDate.Today)
      expect(richDateToday.toString()).toBe(RelativeDate.Today)
    })
  })

  describe('resolve', () => {
    it('resolves to the current date for Today', () => {
      const richDateToday = new RichDate(RelativeDate.Today)
      const fmt = 'dd/MM/yyyy'

      expect(format(richDateToday.resolve(), fmt)).toEqual(
        format(new Date(), fmt),
      )
    })

    it('resolves to the previous date for Yesterday', () => {
      const richDateYesterday = new RichDate(RelativeDate.Yesterday)
      const expectedDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      expect(richDateYesterday.resolve()).toEqual(expectedDate)
    })

    it('resolves to the next date for Tomorrow', () => {
      const richDateTomorrow = new RichDate(RelativeDate.Tomorrow)
      const expectedDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      expect(richDateTomorrow.resolve()).toEqual(expectedDate)
    })

    it('resolves to Today for invalid relative dates', () => {
      // @ts-ignore
      const richDateInvalid = new RichDate('invalid')
      expect(richDateInvalid.resolve()).toEqual(new Date())
    })

    it('returns the exact date for specific dates', () => {
      const customDate = new Date(2020, 0, 1)
      const richDate = new RichDate(customDate)
      expect(richDate.resolve()).toEqual(customDate)
    })
  })
})
