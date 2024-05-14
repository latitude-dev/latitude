import { vi, describe, it, expect, beforeEach } from 'vitest'
import ClickHouseConnector from './index'
import { readFileSync } from 'fs'
import { createClient } from '@clickhouse/client'
import { DataType } from '@latitude-data/query_result'

vi.mock('@clickhouse/client', () => ({
  createClient: vi.fn(),
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) =>
    Buffer.from(`mocked-content-for-${path}`),
  ),
}))

describe('ClickHouseConnector TLS Configurations', () => {
  beforeEach(() => {
    vi.mocked(createClient).mockClear()
  })

  it('builds TLS config from provided options', () => {
    new ClickHouseConnector({
      source: vi.fn(),
      connectionParams: {
        username: 'user',
        password: 'password',
        database: 'database',
        url: 'http://localhost',
        tls: {
          ca_cert: 'path/to/ca_cert',
          key: 'path/to/key',
          cert: 'path/to/cert',
        },
      },
    })

    expect(readFileSync).toHaveBeenCalledWith('path/to/ca_cert')
    expect(readFileSync).toHaveBeenCalledWith('path/to/key')
    expect(readFileSync).toHaveBeenCalledWith('path/to/cert')

    const clientConfig = vi.mocked(createClient).mock.calls[0]?.[0]?.tls
    expect(clientConfig).toEqual({
      ca_cert: Buffer.from('mocked-content-for-path/to/ca_cert'),
      key: Buffer.from('mocked-content-for-path/to/key'),
      cert: Buffer.from('mocked-content-for-path/to/cert'),
    })
  })
})

describe('runQuery', () => {
  it('resolves with QueryResult on successful query execution', async () => {
    const queryResultMock = {
      json: vi.fn().mockResolvedValue({
        meta: [{ name: 'id', type: 'Int32' }],
        data: [[1], [2]],
        rows: 2,
      }),
    }
    const clientMock = {
      query: vi.fn().mockResolvedValue(queryResultMock),
    }
    // @ts-expect-error - mock
    vi.mocked(createClient).mockReturnValue(clientMock)

    const connector = new ClickHouseConnector({
      source: vi.fn(),
      connectionParams: {
        username: 'user',
        password: 'password',
        database: 'database',
        url: 'http://localhost',
      },
    })

    const result = await connector.runQuery({
      sql: 'SELECT * FROM table',
      resolvedParams: [],
      accessedParams: {},
      config: {},
    })

    expect(result.rowCount).toBe(2)
    expect(result.fields).toEqual([{ name: 'id', type: DataType.Integer }])
    expect(result.rows).toEqual([[1], [2]])
  })

  it('rejects with QueryError on query execution failure', async () => {
    const clientMock = {
      query: vi.fn().mockRejectedValue(new Error('query error')),
    }
    // @ts-expect-error - mock
    vi.mocked(createClient).mockReturnValue(clientMock)

    const connector = new ClickHouseConnector({
      source: vi.fn(),
      connectionParams: {
        username: 'user',
        password: 'password',
        database: 'database',
        url: 'http://localhost',
      },
    })

    await expect(
      connector.runQuery({
        sql: 'SELECT * FROM table',
        resolvedParams: [],
        accessedParams: {},
        config: {},
      }),
    ).rejects.toThrow('query error')
  })
})
