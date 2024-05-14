import mockFs from 'mock-fs'
import { describe, it, expect } from 'vitest'
import { getSource } from '@/tests/helper'
import TestConnector from '@/testConnector'
import { buildDefaultContext } from '@/source'

describe('accessedParams', async () => {
  it('records all accessed params', async () => {
    const refQuery = `SELECT {param('foo')} FROM {param('bar')}`
    mockFs({
      '/my-queries': {
        'source.yml': 'type: internal_test',
        'query.sql': refQuery,
      },
    })
    const queryPath = 'query'
    const source = await getSource(queryPath, '/my-queries')
    const context = buildDefaultContext()
    const connector = new TestConnector({ source, connectionParams: {} })
    const compiledQuery = await connector.compileQuery({
      ...context,
      request: {
        queryPath,
        params: {
          foo: 'foo',
          bar: 'bar',
          baz: 'baz',
          qux: 'qux',
        },
        sql: refQuery,
      },
    })
    expect(compiledQuery.accessedParams['foo']).toBe('foo')
    expect(compiledQuery.accessedParams['bar']).toBe('bar')
    expect(compiledQuery.accessedParams['baz']).toBeUndefined()
    expect(compiledQuery.accessedParams['qux']).toBeUndefined()
  })

  it('records all accessed params in nested queries', async () => {
    const refQuery = "SELECT {param('par3')} FROM {ref('nested/query.sql')}"
    mockFs({
      '/my-queries': {
        'source.yml': 'type: internal_test',
        'query.sql': refQuery,
        nested: { 'query.sql': "SELECT {param('par1')} FROM {param('par2')}" },
      },
    })
    const queryPath = 'query'
    const source = await getSource(queryPath, '/my-queries')
    const context = buildDefaultContext()
    const connector = new TestConnector({ source, connectionParams: {} })
    const compiledQuery = await connector.compileQuery({
      ...context,
      request: {
        queryPath,
        params: {
          par1: 1,
          par2: 2,
          par3: 3,
          par4: 4,
        },
        sql: refQuery,
      },
    })

    expect(compiledQuery.accessedParams['par1']).toBe(1)
    expect(compiledQuery.accessedParams['par2']).toBe(2)
    expect(compiledQuery.accessedParams['par3']).toBe(3)
    expect(compiledQuery.accessedParams['par4']).toBeUndefined()
  })

  it('allows accessing the same param multiple times', async () => {
    const refQuery = "SELECT {param('foo')} FROM {param('foo')}"
    mockFs({
      '/my-queries': {
        'source.yml': 'type: internal_test',
        'query.sql': refQuery,
      },
    })
    const queryPath = 'query'
    const source = await getSource(queryPath, '/my-queries')
    const context = buildDefaultContext()
    const connector = new TestConnector({ source, connectionParams: {} })
    const compiledQuery = await connector.compileQuery({
      ...context,
      request: {
        queryPath,
        params: { foo: 'bar' },
        sql: refQuery,
      },
    })
    expect(compiledQuery.accessedParams).toEqual({ foo: 'bar' })
  })
})
