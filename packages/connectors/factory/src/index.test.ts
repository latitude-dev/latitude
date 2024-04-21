import * as fs from 'fs'

import { it, describe, beforeEach, expect } from 'vitest'
import { vi } from 'vitest'
import { createConnector } from './index'

let MockPostgresqlConnector = vi.hoisted(() => vi.fn())

vi.mock('@latitude-data/postgresql-connector', () => ({
  default: MockPostgresqlConnector,
}))

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}))

const sourcePath = '/path/to/source.yaml'

describe('createConnector', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(
      `
      type: postgres
      details:
        host: localhost
        port: 5432
        user: myuser
        password: LATITUDE__DB_PASSWORD
        database: mydatabase
    `,
    )
  })

  it('fails because it does not find a required env var', async () => {
    await expect(createConnector(sourcePath)).rejects.toThrow(
      `Invalid configuration. Environment variable LATITUDE__DB_PASSWORD was not found in the environment. You can review how to set up secret source credentials in the documentation: https://docs.latitude.so/sources/credentials`,
    )
  })

  it('throw an error if source configuration file is missing', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    await expect(createConnector(sourcePath)).rejects.toThrow(
      `Missing source configuration file in: ${sourcePath}`,
    )
  })

  it('throws an error if "type" is missing in configuration', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      details:
        host: localhost
        port: 5432
        username: myuser
        password: mypassword
        database: mydatabase
    `)

    await expect(createConnector(sourcePath)).rejects.toThrowError(
      'Unsupported connector type: undefined',
    )
  })

  it('throws an error if "type" is invalid in configuration', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      type: invalid
      details:
        host: localhost
        port: 5432
        username: myuser
        password: mypassword
        database: mydatabase
    `)

    await expect(createConnector(sourcePath)).rejects.toThrowError(
      `Unsupported connector type: invalid`,
    )
  })

  it('correctly parses env vars', async () => {
    process.env['LATITUDE__DB_PASSWORD'] = 'mypassword' // eslint-disable-line

    const connector = await createConnector(sourcePath)
    expect(connector).toBeInstanceOf(MockPostgresqlConnector)
    expect(MockPostgresqlConnector).toHaveBeenCalledWith('/path/to', {
      host: 'localhost',
      port: 5432,
      user: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
    })
  })
})
