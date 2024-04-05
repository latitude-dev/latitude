import cache from '$lib/query_service/query_cache'
import { QueryNotFoundError } from '@latitude-data/query_service'
import { GET } from './+server'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import QueryResult from '@latitude-data/query_result'
import { MISSING_KEY } from '$lib/loadToken'

const { default: mockedFindQueryFile } = vi.hoisted(() => {
  return { default: vi.fn() }
})
vi.mock('@latitude-data/query_service', async () => {
  const actual = await vi.importActual('@latitude-data/query_service')
  return { ...actual, default: mockedFindQueryFile }
})
const mockedRunQuery = vi.fn()
const mockedCompileQuery = vi.fn()
mockedCompileQuery.mockReturnValue(
  new Promise((resolve) =>
    resolve({
      compiledQuery: 'SELECT * FROM winterfell',
      resolvedParams: [],
    }),
  ),
)
vi.mock('@latitude-data/connector-factory', () => ({
  createConnector: () => ({
    compileQuery: mockedCompileQuery,
    runCompiled: mockedRunQuery,
  }),
}))

const MOCK_QUERY_FILE = {
  queryPath: 'path/to/query',
  sourcePath: 'path/to/source',
}
const queryFound = () => Promise.resolve(MOCK_QUERY_FILE)

describe('GET endpoint', () => {
  const PAYLOAD = { fields: [], rows: [], rowCount: 0 }

  beforeAll(() => {
    vi.spyOn(cache, 'find').mockReturnValue(null)
    mockedFindQueryFile.mockImplementation(queryFound)
  })

  it('should return JSON response for successful query execution', async () => {
    const queryResult = new QueryResult(PAYLOAD)
    mockedRunQuery.mockResolvedValueOnce(queryResult)
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('should return the cached query if available', async () => {
    const queryResult = new QueryResult(PAYLOAD)
    vi.spyOn(cache, 'find').mockReturnValueOnce(queryResult)
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('should return 404 status if the query file is not found', async () => {
    mockedFindQueryFile.mockRejectedValue(
      new QueryNotFoundError('Query file not found'),
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Query file not found')
  })

  it('should return 500 status on query execution error', async () => {
    vi.spyOn(cache, 'find').mockReturnValueOnce(null)
    mockedFindQueryFile.mockResolvedValueOnce(MOCK_QUERY_FILE)
    mockedRunQuery.mockRejectedValue(new Error('Query execution failed'))

    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Query execution failed')
  })

  it('return generic error when is production', async () => {
    vi.spyOn(cache, 'find').mockReturnValueOnce(null)
    import.meta.env.PROD = true
    mockedRunQuery.mockRejectedValue(new Error('Query execution failed'))

    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('There was an error in this query')
    import.meta.env.PROD = false
  })

  it('fail with invalid __token', async () => {
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?__token=wrongToken'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe(MISSING_KEY)
  })
})
