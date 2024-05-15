import { describe, it, expect } from 'vitest'
import addDefaultAttributes from './addDefaultAttributes'
import { PartialThemeAttributes } from './types'

describe('addDefaultAttributes', () => {
  it('should add default attributes when background and foreground are provided', () => {
    const attrs: PartialThemeAttributes = {
      background: 'white',
      foreground: 'black',
    }
    const expected: PartialThemeAttributes = {
      card: 'white',
      'card-foreground': 'black',
      popover: 'white',
      'popover-foreground': 'black',
      background: 'white',
      foreground: 'black',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should not overwrite existing attributes', () => {
    const attrs: PartialThemeAttributes = {
      background: 'white',
      foreground: 'black',
      card: 'gray',
    }
    const expected: PartialThemeAttributes = {
      card: 'gray',
      'card-foreground': 'black',
      popover: 'white',
      'popover-foreground': 'black',
      background: 'white',
      foreground: 'black',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should handle missing background and foreground attributes', () => {
    const attrs: PartialThemeAttributes = {
      card: 'gray',
    }
    const expected: PartialThemeAttributes = {
      card: 'gray',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should not include undefined attributes', () => {
    const attrs: PartialThemeAttributes = {
      background: 'white',
      foreground: undefined,
    }
    const expected: PartialThemeAttributes = {
      card: 'white',
      popover: 'white',
      background: 'white',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should handle empty attributes object', () => {
    const attrs: PartialThemeAttributes = {}
    const expected: PartialThemeAttributes = {}
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should correctly handle only foreground attribute', () => {
    const attrs: PartialThemeAttributes = {
      foreground: 'black',
    }
    const expected: PartialThemeAttributes = {
      'card-foreground': 'black',
      'popover-foreground': 'black',
      foreground: 'black',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should correctly handle only background attribute', () => {
    const attrs: PartialThemeAttributes = {
      background: 'white',
    }
    const expected: PartialThemeAttributes = {
      card: 'white',
      popover: 'white',
      background: 'white',
    }
    const result = addDefaultAttributes(attrs)
    expect(result).toEqual(expected)
  })

  it('should not mutate the input attributes object', () => {
    const attrs: PartialThemeAttributes = {
      background: 'white',
      foreground: 'black',
    }
    const attrsClone = { ...attrs }

    addDefaultAttributes(attrs)

    expect(attrs).toEqual(attrsClone)
  })
})
