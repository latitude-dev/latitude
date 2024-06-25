import { vi, describe, it, expect, beforeEach } from 'vitest'
import MysqlConnector from './index'
import { readFileSync } from 'fs'
import pkg from 'mysql2/promise'

const { createPool } = pkg

vi.mock('mysql2/promise', async (importOriginal) => {
  const app = (await importOriginal()) as Object & { default: Object }

  return {
    ...app,
    default: {
      ...app.default,
      createPool: vi.fn(),
    },
  }
})

vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => `mocked-content-for-${path}`),
}))

describe('MysqlConnector SSL Configurations', () => {
  beforeEach(() => {
    vi.mocked(createPool).mockClear()
  })

  it('passes boolean SSL config correctly', () => {
    new MysqlConnector({
      source: vi.fn(),
      connectionParams: {
        user: 'user',
        password: 'password',
        database: 'database',
        host: 'host',
        ssl: true,
      },
    })

    const poolConfig = vi.mocked(createPool).mock.calls[0]?.[0]?.ssl
    expect(poolConfig).toEqual({})
  })

  it('uses readFileSync and passes SSL files content', () => {
    new MysqlConnector({
      source: vi.fn(),
      connectionParams: {
        user: 'user',
        password: 'password',
        database: 'database',
        host: 'localhost',
        ssl: {
          ca: 'path/to/ca',
          key: 'path/to/key',
          cert: 'path/to/cert',
        },
      },
    })

    expect(readFileSync).toHaveBeenCalledWith('path/to/ca')
    expect(readFileSync).toHaveBeenCalledWith('path/to/key')
    expect(readFileSync).toHaveBeenCalledWith('path/to/cert')

    const poolConfig = vi.mocked(createPool).mock.calls[0]?.[0]?.ssl
    expect(poolConfig).toEqual({
      rejectUnauthorized: undefined,
      ca: 'mocked-content-for-path/to/ca',
      key: 'mocked-content-for-path/to/key',
      cert: 'mocked-content-for-path/to/cert',
    })
  })
})

describe('runQuery', () => {
  it('rejects with ConnectionError when pool.getConnection fails', async () => {
    const poolMock = {
      getConnection: vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((_, reject) => reject(new Error('connection error'))),
        ),
    }
    // @ts-expect-error - Mock
    vi.mocked(createPool).mockReturnValue(poolMock)

    const connector = new MysqlConnector({
      source: vi.fn(),
      connectionParams: {
        user: 'user',
        password: 'password',
        database: 'database',
        host: 'host',
      },
    })

    await expect(
      connector.runQuery({
        sql: 'sql',
        resolvedParams: [],
        accessedParams: {},
      }),
    ).rejects.toThrow('connection error')
  })

  it('releases the connection when connection.query completes', async () => {
    const connectionMock = {
      execute: vi
        .fn()
        .mockImplementationOnce(
          (_, __) => new Promise((resolve) => resolve([[], []])),
        ),
      release: vi.fn(),
    }
    const poolMock = {
      end: vi.fn(),
      getConnection: vi
        .fn()
        .mockImplementationOnce(
          () => new Promise((resolve) => resolve(connectionMock)),
        ),
    }
    // @ts-expect-error - Mock
    vi.mocked(createPool).mockReturnValue(poolMock)

    const connector = new MysqlConnector({
      source: vi.fn(),
      connectionParams: {
        user: 'user',
        password: 'password',
        database: 'database',
        host: 'host',
      },
    })

    await connector.runQuery({
      sql: 'sql',
      resolvedParams: [],
      accessedParams: {},
    })

    expect(connectionMock.release).toHaveBeenCalled()
  })
})
