import { describe, it, expect } from 'vitest'
import { splitInclusive } from './test'

describe('splitInclusive', () => {
  it('splits a string by a single separator and include the separator in the result', () => {
    const result = splitInclusive('foo bar', [' '])
    expect(result).toEqual(['foo', ' ', 'bar'])
  })

  it('splits a string by multiple separators and include the separators in the result', () => {
    const result = splitInclusive('foo-bar baz', [' ', '-'])
    expect(result).toEqual(['foo', '-', 'bar', ' ', 'baz'])
  })

  it('correctly splits spaces and line breaks', () => {
    const result = splitInclusive('foo bar\nbaz', [' ', '\n'])
    expect(result).toEqual(['foo', ' ', 'bar', '\n', 'baz'])
  })

  it('handles consecutive separators correctly', () => {
    const result = splitInclusive('foo--bar  baz', [' ', '-'])
    expect(result).toEqual(['foo', '-', '-', 'bar', ' ', ' ', 'baz'])
  })

  it('handles a string without any of the separators correctly', () => {
    const result = splitInclusive('foobar', [' ', '-'])
    expect(result).toEqual(['foobar'])
  })

  it('returns an empty array when the input is an empty string', () => {
    const result = splitInclusive('', [' ', '-'])
    expect(result).toEqual([])
  })

  it('handles separators at the beginning and end of the string', () => {
    const result = splitInclusive('-foo bar-', [' ', '-'])
    expect(result).toEqual(['-', 'foo', ' ', 'bar', '-'])
  })

  it('handles a single character string', () => {
    const result = splitInclusive('a', [' ', '-'])
    expect(result).toEqual(['a'])
  })

  it('handles a string with only separators', () => {
    const result = splitInclusive('---', ['-'])
    expect(result).toEqual(['-', '-', '-'])
  })
})
