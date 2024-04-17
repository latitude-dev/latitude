import { it, describe, beforeEach, afterEach, expect, vi } from 'vitest'
import mockFs from 'mock-fs'
import fs from 'fs'
import SourceManager from '.'
import TestConnector from '@latitude-data/test-connector'
import yaml from 'yaml'

const mockCreateConnector = vi
  .fn()
  .mockImplementation((rootPath: string, _: string, details: object) =>
    Promise.resolve(new TestConnector(rootPath, details)),
  )
vi.mock('./lib/createConnector', () => {
  return {
    default: (...args: any) => mockCreateConnector(...args),
    getConnectorPackage: () => '@latitude-data/test-connector',
  }
})

const sourceSchema = {
  type: 'test',
  details: {
    fail: false,
  },
  config: {
    ttl: 2000,
  },
}

const QUERIES_DIR = '/path/to/queries'

describe('Source', () => {
  const sourceManager = new SourceManager(QUERIES_DIR)

  beforeEach(async () => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': yaml.stringify(sourceSchema),
        'query.sql': 'query1',
        nested: {
          'query.sql': 'query2',
        },
      },
    })
  })

  afterEach(async () => {
    mockFs.restore()
    mockCreateConnector.mockClear()

    await sourceManager.clearAll()
  })

  it('initializes with the correct path and config', async () => {
    const source = await sourceManager.loadFromQuery('query')

    expect(source.path).toBe(`${QUERIES_DIR}/source.yml`)
    expect(source.type).toBe(sourceSchema.type)
    expect(source.config).toEqual(sourceSchema.config)
  })

  it('does not instantiate the connector until it is needed', async () => {
    const source = await sourceManager.loadFromQuery('query')
    expect(mockCreateConnector).not.toHaveBeenCalled()

    await source.compileQuery({ queryPath: 'query', params: {} })
    expect(mockCreateConnector).toHaveBeenCalledOnce()
  })

  it('reuses the same connector for multiple queries', async () => {
    const source = await sourceManager.loadFromQuery('query')
    await source.compileQuery({ queryPath: 'query', params: {} })
    await source.compileQuery({ queryPath: 'nested/query', params: {} })

    expect(mockCreateConnector).toHaveBeenCalledOnce()
  })

  it('returns the source config when compiling a query', async () => {
    const source = await sourceManager.loadFromQuery('query')
    const compiledQuery = await source.compileQuery({
      queryPath: 'query',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(2000)
  })

  it('merges the source config with the defined config in the query, prioritizing the query config', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `{@config ttl = 12345}`)
    const source = await sourceManager.loadFromQuery('query')
    const compiledQuery = await source.compileQuery({
      queryPath: 'query',
      params: {},
    })

    expect(compiledQuery.config.ttl).toBe(12345)
  })
})
