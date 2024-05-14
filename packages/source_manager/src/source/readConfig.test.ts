import { it, describe, beforeEach, afterEach, expect } from 'vitest'
import readSourceConfig from './readConfig'
import mockFs from 'mock-fs'
import fs from 'fs'
import yaml from 'yaml'

const mockConfig = {
  type: 'postgres',
  details: {
    host: 'localhost',
    port: 5432,
    user: 'myuser',
    password: 'mypassword',
    database: 'mydatabase',
  },
  options: {
    ssl: 420,
  },
}

let envVars = {}
const saveEnvVars = () => {
  envVars = { ...process.env }
}
const restoreEnvVars = () => {
  process.env = { ...envVars }
}

describe('readConfig', () => {
  beforeEach(() => {
    mockFs({
      '/source.yaml': yaml.stringify(mockConfig),
    })

    saveEnvVars()
  })

  afterEach(() => {
    mockFs.restore()
    restoreEnvVars()
  })

  function setSourceConfig(newConfig: Record<string, unknown>) {
    fs.writeFileSync('/source.yaml', yaml.stringify(newConfig))
  }

  it('throws an error if type is missing', () => {
    setSourceConfig({})
    expect(() => readSourceConfig('/source.yaml')).toThrowError(
      /Missing 'type' in configuration/,
    )
  })

  it('reads the config and return it when valid', () => {
    setSourceConfig({ type: 'example-type' })
    const config = readSourceConfig('/source.yaml')
    expect(config.type).toBe('example-type')
  })

  it('resolves present environment variables starting with LATITUDE__', () => {
    const config = { ...mockConfig }
    config.details.password = 'LATITUDE__DB_PASSWORD'
    setSourceConfig(config)
    process.env['LATITUDE__DB_PASSWORD'] = 'mysecretpassword' // eslint-disable-line turbo/no-undeclared-env-vars

    const result = readSourceConfig('/source.yaml')
    expect(result.details?.password).toBe('mysecretpassword')
  })

  it('throws an error if environment variable is not set', () => {
    const config = { ...mockConfig }
    config.details.password = 'LATITUDE__DB_PASSWORD'
    setSourceConfig(config)

    expect(() => readSourceConfig('/source.yaml')).toThrowError(
      /Invalid configuration/,
    )
  })

  it('does not resolve environment variables that do not start with LATITUDE__', () => {
    const config = { ...mockConfig }
    config.details.password = 'DB_PASSWORD'
    setSourceConfig(config)

    process.env['DB_PASSWORD'] = 'mysecretpassword' // eslint-disable-line turbo/no-undeclared-env-vars

    const result = readSourceConfig('/source.yaml')
    expect(result.details?.password).toBe('DB_PASSWORD')
  })
})
