import cache from '$lib/query_service/query_cache'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QueryResult, { DataType } from '@latitude-data/query_result'
import { MISSING_KEY } from '$lib/loadToken'
import mockFs from 'mock-fs'
import fs from 'fs'
import { QUERIES_DIR } from '$lib/server/sourceManager'
import { GET } from './+server'
import TestConnector from '@latitude-data/test-connector'
import type { CompiledQuery, QueryRequest } from '@latitude-data/base-connector'
import path from 'path'
import { QueryNotFoundError } from '@latitude-data/source-manager'

const runQuerySpy = vi.fn()
const connector = new TestConnector(QUERIES_DIR, {
  onRunQuery: runQuerySpy,
})

vi.mock('$lib/server/sourceManager', async () => {
  const QUERIES_DIR = 'static/.latitude/queries'
  return {
    default: {
      loadFromQuery: async (query: string) => {
        const filePath = path.join(
          QUERIES_DIR,
          query.endsWith('.sql') ? query : `${query}.sql`,
        )
        if (!fs.existsSync(filePath)) {
          throw new QueryNotFoundError(`Query file not found at ${filePath}`)
        }

        return {
          compileQuery: (request: QueryRequest) =>
            connector.compileQuery(request),
          runCompiledQuery: (compiledQuery: CompiledQuery) =>
            connector.runCompiled(compiledQuery),
        }
      },
    },
    QUERIES_DIR,
  }
})

const PAYLOAD = {
  fields: [{ name: 'value', type: DataType.String }],
  rows: [['test']],
  rowCount: 1,
}

mockFs({
  [QUERIES_DIR]: {
    'source.yml': 'type: duckdb',
    'query.sql': 'test',
  },
  '/tmp/.latitude': {},
})

describe('GET endpoint', async () => {
  beforeEach(() => {
    vi.spyOn(cache, 'find').mockReturnValue(null)
    vi.resetAllMocks()
    import.meta.env.PROD = false
  })

  it('should return JSON response for successful query execution', async () => {
    const response = await GET({
      params: { query: 'query' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('should return the cached query if available', async () => {
    const queryResult = new QueryResult(PAYLOAD)
    vi.spyOn(cache, 'find').mockReturnValueOnce(queryResult)

    const response = await GET({
      params: { query: 'query' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('should return 404 status if the query file is not found', async () => {
    const response = await GET({
      params: { query: 'Fakequery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(404)
  })

  it('should return 500 status on query execution error', async () => {
    vi.spyOn(cache, 'find').mockReturnValueOnce(null) // No cached query
    const customErrorMessage = 'Custom error message'
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `FAIL ${customErrorMessage}`) // (TestConnector feature)

    const response = await GET({
      params: { query: 'query' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe(customErrorMessage)
  })

  it('return generic error when is production', async () => {
    import.meta.env.PROD = true
    vi.spyOn(cache, 'find').mockReturnValueOnce(null) // No cached query

    const customErrorMessage = 'Custom error message'
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `FAIL ${customErrorMessage}`) // (TestConnector feature)

    const response = await GET({
      params: { query: 'query' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('There was an error in this query')
  })

  it('fail with invalid __token', async () => {
    delete process.env.LATITUDE_MASTER_KEY // Ensure the token is not set (it may have been set by external sources)
    const response = await GET({
      params: { query: 'query' },
      url: new URL('http://localhost?__token=wrongToken'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe(MISSING_KEY)
  })
})
