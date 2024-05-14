import { it, describe, expect } from 'vitest'
import { getSource } from '@/tests/helper'
import { ConnectorError } from '@/types'

describe('readMetadata', () => {
  it('returns the source config', async () => {
    const queryPath = 'valid-source/query'
    const source = await getSource(queryPath)
    const { config } = await source.getMetadataFromQuery(queryPath)

    expect(config.ttl).toBe(2000)
  })

  it('merge source config with query config', async () => {
    const queryPath = 'valid-source/nested/query_with_ttl'
    const source = await getSource(queryPath)
    const { config } = await source.getMetadataFromQuery(queryPath)

    expect(config.ttl).toBe(42069)
  })

  it('resolve when query path comes with slash', async () => {
    const querypath = '/valid-source/nested/query_with_ttl'
    const source = await getSource(querypath)
    const { config } = await source.getMetadataFromQuery(querypath)

    expect(config.ttl).toBe(42069)
  })
})

describe('compileQuery', () => {
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
