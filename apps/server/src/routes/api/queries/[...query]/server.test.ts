import mockFs from 'mock-fs'
import fs from 'fs'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import QueryResult, { DataType } from '@latitude-data/query_result'
import cache from '$lib/query_service/query_cache'
import { MISSING_KEY } from '$lib/loadToken'
import { QUERIES_DIR } from '$lib/constants'
import { GET } from './+server'

const PAYLOAD = {
  fields: [{ name: 'value', type: DataType.String }],
  rows: [['test']],
  rowCount: 1,
}

describe('GET endpoint', async () => {
  beforeEach(() => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query.sql': 'test',
      },
      '/tmp/.latitude': {},
    })
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
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `FAIL ${customErrorMessage}`)

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
