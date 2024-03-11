import cache from '$lib/query_service/query_cache'
import findQueryFile, {
  QueryNotFoundError,
} from '$lib/query_service/findQueryFile'
import { GET } from './+server'
import { createConnector } from '@latitude-data/connector-factory'
import { describe, it, expect, vi, beforeAll, Mock } from 'vitest'
import QueryResult from '@latitude-data/query_result'

// Mocking external dependencies
vi.mock('$lib/query_service/findQueryFile', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    // @ts-expect-error - TS doesn't know that we're mocking the default export
    ...actual,
    default: vi.fn(),
  }
})
vi.mock('@latitude-data/connector-factory', () => ({
  createConnector: vi.fn(),
}))

describe('GET endpoint', () => {
  const mockRunQuery: Mock = vi.fn()
  const mockCompileQuery: Mock = vi.fn()

  beforeAll(() => {
    vi.spyOn(cache, 'find').mockReturnValue(null)
    // @ts-expect-error - TS doesn't know that we're mocking the default export
    findQueryFile.mockImplementation(() => {
      return Promise.resolve({
        queryPath: 'path/to/query',
        sourcePath: 'path/to/source',
      })
    })

    const conn = createConnector as Mock
    conn.mockImplementation(() => {
      return {
        compileQuery: mockCompileQuery,
        runCompiled: mockRunQuery,
      }
    })

    mockCompileQuery.mockReturnValue(
      new Promise((resolve) =>
        resolve({
          compiledQuery: 'SELECT * FROM winterfell',
          resolvedParams: [],
        })
      )
    )
  })

  const payload = {
    fields: [],
    rows: [],
    rowCount: 0,
  }

  it('should return JSON response for successful query execution', async () => {
    const queryResult = new QueryResult(payload)
    mockRunQuery.mockResolvedValueOnce(queryResult)
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(payload)
  })

  it('should return the cached query if available', async () => {
    const queryResult = { toJSON: () => JSON.stringify(payload) }
    vi.spyOn(cache, 'find').mockReturnValueOnce(
      queryResult as unknown as QueryResult
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(payload)
  })

  it('should compute the query even if it is cached because __force parameter was passed', async () => {
    const queryResult = new QueryResult(payload)
    const conn = createConnector as Mock
    conn.mockImplementation(() => {
      return {
        compileQuery: mockCompileQuery,
        runCompiled: mockRunQuery,
      }
    })
    mockRunQuery.mockResolvedValueOnce(queryResult)
    vi.spyOn(cache, 'find').mockReturnValueOnce(
      queryResult as unknown as QueryResult
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__force=true'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(payload)
  })

  it('should return 500 status on query execution error', async () => {
    vi.spyOn(cache, 'find').mockReturnValueOnce(null)
    mockRunQuery.mockRejectedValue(new Error('Query execution failed'))

    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Query execution failed')
  })

  it('should return 404 status if the query file is not found', async () => {
    const findQueryFileMock = findQueryFile as Mock
    findQueryFileMock.mockRejectedValue(
      new QueryNotFoundError('Query file not found')
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Query file not found')
  })

  it('return generic error when is production', async () => {
    import.meta.env.PROD = true
    mockRunQuery.mockRejectedValue(new Error('Query execution failed'))

    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('There was an error in this query')
  })

})
