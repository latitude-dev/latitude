import mockFs from 'mock-fs'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import findOrCompute from '$lib/query_service/find_or_compute'
import { signJwt } from '@latitude-data/jwt'
import { GET } from './+server'
import QueryResult from '@latitude-data/query_result'
import { QUERIES_DIR } from '$lib/server/sourceManager'
import { Source } from '@latitude-data/source-manager'

const PAYLOAD = { fields: [], rows: [], rowCount: 0 }
const queryResult = new QueryResult(PAYLOAD)
const { default: mockedFindOrCompute } = await vi.hoisted(async () => {
  const actual = await vi.importActual('$lib/query_service/find_or_compute')
  const original = actual.default as typeof findOrCompute
  return { default: vi.fn(original) }
})
vi.mock('$lib/query_service/find_or_compute', () => ({
  ...vi.importActual('$lib/query_service/find_or_compute'),
  default: mockedFindOrCompute,
}))

describe('Special params', async () => {
  beforeEach(() => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'testQuery.sql': 'SELCET * FROM table',
      },
      '/tmp/.latitude': {},
    })
  })

  afterEach(() => {
    mockedFindOrCompute.mockRestore()
  })

  it('computes query when __force is passed', async () => {
    mockedFindOrCompute.mockReturnValueOnce(
      // @ts-expect-error - we're mocking the function
      Promise.resolve({ queryResult, compiledQuery: { config: {} } }),
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__force=true'),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      source: expect.any(Source),
      query: 'testQuery',
      queryParams: { param: 42 },
      force: true,
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('computes query when __force=$text:force is passed', async () => {
    mockedFindOrCompute.mockReturnValueOnce(
      // @ts-expect-error - we're mocking the function
      Promise.resolve({ queryResult, compiledQuery: { config: {} } }),
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__force=$text:true'),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      source: expect.any(Source),
      query: 'testQuery',
      queryParams: { param: 42 },
      force: true,
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('parses a valid __token', async () => {
    const secretKey = 'SECRET_MASTER_KEY'
    process.env['LATITUDE_MASTER_KEY'] = secretKey
    const token = await signJwt({
      payload: { company_id: 33 },
      secretKey,
    })
    mockedFindOrCompute.mockReturnValueOnce(
      // @ts-expect-error - we're mocking the function
      Promise.resolve({ queryResult, compiledQuery: { config: {} } }),
    )

    await GET({
      params: { query: 'testQuery' },
      url: new URL(`http://localhost?__token=${token}`),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      source: expect.any(Source),
      query: 'testQuery',
      queryParams: { company_id: 33 },
      force: false,
    })
  })

  it('returns a csv file when __download is passed', async () => {
    mockedFindOrCompute.mockReturnValueOnce(
      // @ts-expect-error - we're mocking the function
      Promise.resolve({ queryResult, compiledQuery: { config: {} } }),
    )
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__download=true'),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      source: expect.any(Source),
      query: 'testQuery',
      queryParams: { param: 42 },
      force: false,
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/csv')
    expect(await response.text()).toBe(queryResult.toCSV())
  })
})
