import { it, describe, expect } from 'vitest'
import SourceManager from '@/manager'

import { QUERIES_DIR } from '@/tests/helper'

describe('Source', () => {
  const sourceManager = new SourceManager(QUERIES_DIR)

  it('returns the source config when compiling a query', async () => {
    const source = await sourceManager.loadFromQuery('valid-source/query')
    const compiledQuery = await source.compileQuery({
      queryPath: 'query',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(2000)
  })

  it('merge source config with query config', async () => {
    const queryPath = 'valid-source/nested/query_with_ttl'
    const source = await sourceManager.loadFromQuery(queryPath)
    const compiledQuery = await source.compileQuery({
      queryPath: 'nested/query_with_ttl',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(42069)
  })
})
