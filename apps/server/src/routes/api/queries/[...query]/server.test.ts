import findQueryFile from '$lib/findQueryFile'
import { GET } from './+server'
import { createConnector } from '@latitude-sdk/connector-factory'
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest'

// Mocking external dependencies
vi.mock('$lib/findQueryFile', () => ({
  default: vi.fn(),
}))
vi.mock('@latitude-sdk/connector-factory', () => ({
  createConnector: vi.fn(),
}))

describe('GET endpoint', () => {
  let mockConnectorQuery: Mock

  afterEach(() => {
    vi.resetAllMocks()
  })

  beforeEach(() => {
    mockConnectorQuery = vi.fn()
      ; (findQueryFile as Mock).mockImplementation(() => {
        return Promise.resolve({
          queryPath: 'path/to/query',
          sourcePath: 'path/to/source',
        })
      })
    const conn = createConnector as Mock
    conn.mockImplementation(() => {
      return { query: mockConnectorQuery }
    })
  })

  it('should return JSON response for successful query execution', async () => {
    const queryResultPayload = { fields: [], rows: [], rowCount: 0 }
    const queryResult = { payload: () => queryResultPayload }
    mockConnectorQuery.mockResolvedValue(queryResult)
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost?param=42'),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(queryResultPayload)
  })

  it('should return 500 status on query execution error', async () => {
    mockConnectorQuery.mockRejectedValue(new Error('Query execution failed'))
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Query execution failed')
  })

  it('should return 404 status if the query file is not found', async () => {
    const findQueryFileMock = findQueryFile as Mock
    findQueryFileMock.mockRejectedValue(new Error('Query file not found'))
    const response = await GET({
      params: { query: 'testQuery' },
      url: new URL('http://localhost'),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Query file not found')
  })
})
