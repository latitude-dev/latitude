import findOrCompute from '$lib/query_service/find_or_compute'
import { signJwt } from '@latitude-data/jwt'
import { GET } from './+server'
import { describe, it, expect, vi, afterEach } from 'vitest'
import QueryResult from '@latitude-data/query_result'

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
  afterEach(() => {
    mockedFindOrCompute.mockRestore()
  })

  it('compute query when __force is passed', async () => {
    mockedFindOrCompute.mockReturnValueOnce(Promise.resolve(queryResult))
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__force=true'),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      query: 'testQuery',
      queryParams: { param: 42 },
      force: true
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('compute query when __force=$text:force is passed', async () => {
    mockedFindOrCompute.mockReturnValueOnce(Promise.resolve(queryResult))
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42&__force=$text:true'),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      query: 'testQuery',
      queryParams: { param: 42 },
      force: true
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(PAYLOAD)
  })

  it('parse a valid __token', async () => {
    const secretKey = 'SECRET_MASTER_KEY'
    process.env['LATITUDE_MASTER_KEY'] = secretKey
    const token = await signJwt({
      payload: { company_id: 33 },
      secretKey
    })
    mockedFindOrCompute.mockReturnValueOnce(Promise.resolve(queryResult))

    await GET({
      params: { query: 'testQuery' },
      url: new URL(`http://localhost?__token=${token}`),
    })
    expect(mockedFindOrCompute).toHaveBeenCalledWith({
      query: 'testQuery',
      queryParams: { company_id: 33 },
      force: false
    })
  })
})

