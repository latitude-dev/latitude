import { vi, describe, it, expect, beforeEach } from 'vitest'
import PostgresConnector from './index'
import { readFileSync } from 'fs'
import pg from 'pg'

vi.mock('pg', () => ({
  default: {
    Pool: vi.fn(),
  },
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => `mocked-content-for-${path}`),
}))

describe('PostgresConnector SSL Configurations', () => {
  beforeEach(() => {
    vi.mocked(pg.Pool).mockClear()
  })

  it('passes boolean SSL config correctly', () => {
    new PostgresConnector('rootPath', {
      user: 'user',
      password: 'password',
      database: 'database',
      host: 'host',
      port: 5432,
      ssl: true,
    })

    const poolConfig = vi.mocked(pg.Pool).mock.calls[0]?.[0]
    expect(poolConfig?.ssl).toBe(true)
  })

  it('uses readFileSync and passes SSL files content', () => {
    new PostgresConnector('rootPath', {
      user: 'user',
      password: 'password',
      database: 'database',
      host: 'host',
      port: 5432,
      ssl: {
        sslmode: 'require',
        ca: 'path/to/ca',
        key: 'path/to/key',
        cert: 'path/to/cert',
      },
    })

    expect(readFileSync).toHaveBeenCalledWith('path/to/ca')
    expect(readFileSync).toHaveBeenCalledWith('path/to/key')
    expect(readFileSync).toHaveBeenCalledWith('path/to/cert')

    const poolConfig = vi.mocked(pg.Pool).mock.calls[0]?.[0]?.ssl

    expect(poolConfig).toEqual({
      sslmode: 'require',
      rejectUnauthorized: undefined,
      ca: 'mocked-content-for-path/to/ca',
      key: 'mocked-content-for-path/to/key',
      cert: 'mocked-content-for-path/to/cert',
    })
  })
})
