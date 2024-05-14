import { it, describe, expect } from 'vitest'
import { getSource } from '@/tests/helper'
import { ConnectorError } from '@/types'

describe('compileQuery', () => {
  it('returns the source config when compiling a query', async () => {
    const source = await getSource('valid-source/query')
    const compiledQuery = await source.compileQuery({
      queryPath: 'valid-source/query',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(2000)
  })

  it('merge source config with query config', async () => {
    const source = await getSource('valid-source/nested/query_with_ttl')
    const compiledQuery = await source.compileQuery({
      queryPath: 'valid-source/nested/query_with_ttl',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(42069)
  })

  it('resolve when query path comes with slash', async () => {
    const source = await getSource('valid-source/nested/query_with_ttl')
    const compiledQuery = await source.compileQuery({
      queryPath: '/valid-source/nested/query_with_ttl',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(42069)
  })

  it('it fails when trying to get a query from another source', async () => {
    const source = await getSource('valid-source/nested/query_with_ttl')
    await expect(
      source.compileQuery({
        queryPath: 'another-source/query',
        params: {},
      }),
    ).rejects.toThrowError(
      new ConnectorError(
        'Query path "another-source/query" is not in source "valid-source"',
      ),
    )
  })
})
