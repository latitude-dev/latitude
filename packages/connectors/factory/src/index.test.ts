import * as fs from 'fs'
import * as postgresConnector from '@latitude-sdk/postgresql-connector'
import { createConnector, ConnectorType } from './index'
import { it, describe, beforeEach, afterEach, expect } from 'vitest'
import { vi } from 'vitest'

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}))

describe('createConnector', () => {
  const sourcePath = '/path/to/source.yaml'

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

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a PostgresConnector instance', () => {
    const connector = createConnector(sourcePath)

    expect(connector).toBeInstanceOf(postgresConnector.PostgresConnector)
  })

  it('should correctly parse env vars', () => {
    process.env['LATITUDE__DB_PASSWORD'] = 'mypassword'
    const spy = vi
      .spyOn(postgresConnector, 'PostgresConnector')
      // @ts-ignore
      .mockReturnValue(10)

    const connector = createConnector(sourcePath)
    expect(connector).toBeInstanceOf(postgresConnector.PostgresConnector)
    expect(spy).toHaveBeenCalledWith('/path/to', {
      host: 'localhost',
      port: 5432,
      user: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
    })
  })

  it('should throw an error if source configuration file is missing', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    expect(() => createConnector(sourcePath)).toThrowError(
      `Missing source configuration file in: ${sourcePath}`,
    )
  })

  it('should throw an error if "type" is missing in configuration', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      details:
        host: localhost
        port: 5432
        username: myuser
        password: mypassword
        database: mydatabase
    `)

    expect(() => createConnector(sourcePath)).toThrowError(
      `Missing 'type' in configuration`,
    )
  })

  it('should throw an error if "details" is missing in configuration', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      type: postgres
    `)

    expect(() => createConnector(sourcePath)).toThrowError(
      `Missing 'details' in configuration`,
    )
  })

  it('should throw an error if "type" is invalid in configuration', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      type: invalid
      details:
        host: localhost
        port: 5432
        username: myuser
        password: mypassword
        database: mydatabase
    `)

    expect(() => createConnector(sourcePath)).toThrowError(
      `Unsupported connector type: invalid`,
    )
  })

  it('should throw an error if "details" is invalid in configuration', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(`
      type: postgres
      details: []
    `)

    expect(() => createConnector(sourcePath)).toThrowError(
      `Invalid 'details' in configuration`,
    )
  })
})
