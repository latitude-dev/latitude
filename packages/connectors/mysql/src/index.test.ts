import { vi, describe, it, expect, beforeEach } from 'vitest'
import { MysqlConnector } from './index'
import { readFileSync } from 'fs'
import { createPool } from 'mysql'

vi.mock('mysql', () => ({
  createPool: vi.fn(),
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => `mocked-content-for-${path}`),
}))

describe('MysqlConnector SSL Configurations', () => {
  beforeEach(() => {
    vi.mocked(createPool).mockClear()
  })

  it('passes boolean SSL config correctly', () => {
    new MysqlConnector('rootPath', {
      user: 'user',
      password: 'password',
      database: 'database',
      host: 'host',
      ssl: true,
    })

    // @ts-expect-error - mock
    const poolConfig = vi.mocked(createPool).mock.calls[0]?.[0]?.ssl
    expect(poolConfig).toEqual({})
  })

  it('uses readFileSync and passes SSL files content', () => {
    new MysqlConnector('rootPath', {
      user: 'user',
      password: 'password',
      database: 'database',
      host: 'host',
      ssl: {
        ca: 'path/to/ca',
        key: 'path/to/key',
        cert: 'path/to/cert',
      },
    })

    expect(readFileSync).toHaveBeenCalledWith('path/to/ca')
    expect(readFileSync).toHaveBeenCalledWith('path/to/key')
    expect(readFileSync).toHaveBeenCalledWith('path/to/cert')

    // @ts-expect-error - mock
    const poolConfig = vi.mocked(createPool).mock.calls[0]?.[0]?.ssl
    expect(poolConfig).toEqual({
      rejectUnauthorized: undefined,
      ca: 'mocked-content-for-path/to/ca',
      key: 'mocked-content-for-path/to/key',
      cert: 'mocked-content-for-path/to/cert',
    })
  })
})
