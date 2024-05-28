import { emptyMetadata, readMetadata } from '..'
import CompileError from '../error/error'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('config tags', async () => {
  it('extracts defined configurations correctly', async () => {
    const query = `
      {@config foo = 5}
      {@config bar = "foo"}
      {@config baz = true}
      Rest of the query
    `
    const { config } = await readMetadata({ query })

    expect(config).toEqual({
      foo: 5,
      bar: 'foo',
      baz: true,
    })
  })

  it('fails when a config tag is not at root level', async () => {
    const query = `
      {#if true}
        {@config foo = 5}
      {/if}
    `

    try {
      await readMetadata({ query })
    } catch (e) {
      expect(e).toBeInstanceOf(CompileError)
      expect((e as CompileError).code).toBe('config-inside-block')
    }
  })

  it('fails when a config tag is not a valid assignment expression', async () => {
    const query = `{@config foo 5}`

    try {
      await readMetadata({ query })
    } catch (e) {
      expect(e).toBeInstanceOf(CompileError)
      expect((e as CompileError).code).toBe('invalid-config-args')
    }
  })

  it('fails when a config value is not a literal', async () => {
    const query = `{@config foo = 5 + 5}`

    try {
      await readMetadata({ query })
    } catch (e) {
      expect(e).toBeInstanceOf(CompileError)
      expect((e as CompileError).code).toBe('invalid-config-value')
    }
  })

  it('fails when a config is already defined', async () => {
    const query = `
      {@config foo = 5}
      {@config foo = 10}
    `
    try {
      await readMetadata({ query })
    } catch (e) {
      expect(e).toBeInstanceOf(CompileError)
      expect((e as CompileError).code).toBe('config-already-defined')
    }
  })
})

describe('supported methods', async () => {
  function mockSupportedMethod() {
    return {
      requirements: {},
      resolve: vi.fn(() => Promise.resolve()),
      readMetadata: vi.fn(() => Promise.resolve(emptyMetadata())),
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('extracts supported methods present in the query correctly', async () => {
    const query = `
      {foo()}
      {bar()}
      {baz()}
    `

    const supportedMethods = {
      foo: mockSupportedMethod(),
      bar: mockSupportedMethod(),
    }

    const { methods } = await readMetadata({ query, supportedMethods })
    expect(methods).toContain('foo')
    expect(methods).toContain('bar')
  })

  it('does not extract method calls that are not from supported methods', async () => {
    const query = `
      {foo()}
      {bar()}
      {baz()}
    `
    const supportedMethods = {
      foo: mockSupportedMethod(),
    }

    const { methods } = await readMetadata({ query, supportedMethods })
    expect(methods).toContain('foo')
    expect(methods).not.toContain('bar')
    expect(methods).not.toContain('baz')
  })

  it('does not extract supported methods that are not present in the query', async () => {
    const query = `
      {foo()}
    `
    const supportedMethods = {
      foo: mockSupportedMethod(),
      bar: mockSupportedMethod(),
    }

    const { methods } = await readMetadata({ query, supportedMethods })
    expect(methods).toContain('foo')
    expect(methods).not.toContain('bar')
  })

  it('does not actually run extracted methods', async () => {
    const query = `
      {foo()}
    `
    const supportedMethods = {
      foo: mockSupportedMethod(),
      bar: mockSupportedMethod(),
    }

    const { methods } = await readMetadata({ query, supportedMethods })
    expect(methods).toContain('foo')
    expect(supportedMethods.foo.resolve).not.toHaveBeenCalled()
  })
})
