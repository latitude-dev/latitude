import { describe, it, expect } from 'vitest'
import { defaultsDeep, removeUndefined } from './utils'

describe('defaultsDeep', () => {
  it('merges a partial object with the default object', () => {
    const defaultObject = { a: 'def_a', b: 'def_b' }
    const partialObject = { a: 'new_a' }
    const result = defaultsDeep(partialObject, defaultObject)
    expect(result).toEqual({
      a: 'new_a',
      b: 'def_b',
    })
  })

  it('merges a partial object with the default object recursively', () => {
    const defaultObject = {
      a: 'def_a',
      b: {
        b1: 'def_b1',
        b2: 'def_b2',
        b3: {
          beta1: 'def_beta1',
          beta2: 'def_beta2',
        },
      },
    }
    const partialObject = {
      b: {
        b1: 'new_b1',
        b3: {
          beta2: 'new_beta2',
        },
      },
    } as Partial<typeof defaultObject>

    const result = defaultsDeep(partialObject, defaultObject)
    expect(result).toEqual({
      a: 'def_a',
      b: {
        b1: 'new_b1',
        b2: 'def_b2',
        b3: {
          beta1: 'def_beta1',
          beta2: 'new_beta2',
        },
      },
    })
  })

  it('replaces full arrays instead of merging them', () => {
    const defaultObject = { a: [1, 2, 3] }
    const partialObject = { a: [4, 5, 6] }
    const result = defaultsDeep(partialObject, defaultObject)
    expect(result).toEqual({
      a: [4, 5, 6],
    })
  })

  it('merges objects instead of fully replacing them', () => {
    const defaultObject = { a: { a1: 'def_a1', a2: 'def_a2' } }
    const partialObject = { a: { a2: 'new_a2' } } as Partial<
      typeof defaultObject
    >
    const result = defaultsDeep(partialObject, defaultObject)
    expect(result).toEqual({
      a: {
        a1: 'def_a1',
        a2: 'new_a2',
      },
    })
  })

  it('adds new attributes not present in the default object', () => {
    const defaultObject = { a: 'def_a' }
    const partialObject = { b: 'new_b' } as Partial<typeof defaultObject>
    const result = defaultsDeep(partialObject, defaultObject)
    expect(result).toEqual({
      a: 'def_a',
      b: 'new_b',
    })
  })
})

describe('removeUndefined', () => {
  it('removes undefined values from the object', () => {
    const obj = { a: 'a', b: undefined, c: 'c' }
    const result = removeUndefined(obj)
    expect(result).toEqual({
      a: 'a',
      c: 'c',
    })
  })

  it('does not remove falsey or null values', () => {
    const obj = { a: undefined, b: null, c: '', d: 0, e: false, f: NaN }
    const result = removeUndefined(obj)
    expect(result).toEqual({
      b: null,
      c: '',
      d: 0,
      e: false,
      f: NaN,
    })
  })

  it('does not remove undefined values from nested objects', () => {
    const obj = { a: 'a', b: { c: undefined, d: 'd' } }
    const result = removeUndefined(obj)
    expect(result).toEqual({
      a: 'a',
      b: {
        c: undefined,
        d: 'd',
      },
    })
  })
})
