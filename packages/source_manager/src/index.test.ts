import { it, describe, beforeEach, afterEach, expect, vi } from 'vitest'
import mockFs from 'mock-fs'
import fs from 'fs'
import SourceManager from '.'
import TestConnector from '@latitude-data/test-connector'

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

describe('SourceManager', () => {
  const readFileSpy = vi.spyOn(fs, 'readFileSync')

  beforeEach(() => {
    mockFs({
      '/path/to/queries': {
        'source.yml': `type: test`,
        'query.sql': 'query1',
        nested: {
          'query.sql': 'query2',
        },
      },
    })
  })

  afterEach(() => {
    mockFs.restore()
    mockCreateConnector.mockClear()
  })

  it('does not load the same connector twice', async () => {
    const queriesDir = '/path/to/queries'

    const query1Path = `query`
    const query2Path = `nested/query`

    const sourceManager = new SourceManager(queriesDir)

    const connector1 = await sourceManager.loadFromQuery(query1Path)
    const connector2 = await sourceManager.loadFromQuery(query2Path)
    expect(readFileSpy).toHaveBeenCalledOnce() // Only read config file once
    expect(connector1.source).toBe(connector2.source)

    await connector1.source.compileQuery({ queryPath: query1Path })
    await connector1.source.compileQuery({ queryPath: query2Path })
    expect(mockCreateConnector).toHaveBeenCalledOnce() // Only instanced once
  })
})

describe('loadFromQuery', () => {
  beforeEach(() => {
    mockFs({
      '/path/to/queries': {
        'source.yml': `type: test`,
        'query.sql': 'query1',
        nestedQuery: {
          'query.sql': 'query2',
        },
        nestedSource: {
          'source.yml': `type: test`,
          'query.sql': 'query3',
        },
      },
    })
  })

  afterEach(() => {
    mockFs.restore()
    mockCreateConnector.mockClear()
  })

  it('finds and loads the source from any query in the same directory', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const { source: connector } = await sourceManager.loadFromQuery('query')
    expect(connector).toBeDefined()
  })

  it('finds and loads the source from any query in a nested directory', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const { source: connector } = await sourceManager.loadFromQuery('query')
    const { source: nestedConnector } =
      await sourceManager.loadFromQuery('nestedQuery/query')
    expect(connector).toBeDefined()
    expect(nestedConnector).toBeDefined()
    expect(connector).toBe(nestedConnector)
  })

  it('finds and loads the source from a query in a nested directory with a source file', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const { source: connector } = await sourceManager.loadFromQuery('query')
    const { source: nestedConnector } =
      await sourceManager.loadFromQuery('nestedSource/query')
    expect(connector).toBeDefined()
    expect(nestedConnector).toBeDefined()
    expect(connector).not.toBe(nestedConnector)
  })

  it('throws an error if the query file does not exist', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    await expect(
      sourceManager.loadFromQuery('nonexistent'),
    ).rejects.toThrowError(
      'Query file not found at /path/to/queries/nonexistent.sql',
    )
  })

  it('throws an error if the query is not in the queries directory', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    await expect(sourceManager.loadFromQuery('../query')).rejects.toThrowError(
      'Query file is not in the queries directory: /path/to/query',
    )
  })
})

describe('loadFromConfigFile', () => {
  beforeEach(() => {
    mockFs({
      '/path/to/queries': {
        'source.yml': `type: test`,
        'query.sql': 'query1',
        nestedQuery: {
          'query.sql': 'query2',
        },
        nestedSource: {
          'source.yml': `type: test`,
          'query.sql': 'query3',
        },
      },
      '/source.yml': `type: test`,
    })
  })

  afterEach(() => {
    mockFs.restore()
    mockCreateConnector.mockClear()
  })

  it('finds and loads the source from a source configuration file', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const connector = await sourceManager.loadFromConfigFile('source.yml')
    expect(connector).toBeDefined()
  })

  it('throws an error if the source file does not exist', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    await expect(
      sourceManager.loadFromConfigFile('nonexistent.yml'),
    ).rejects.toThrowError(
      'Source file not found at /path/to/queries/nonexistent.yml',
    )
  })

  it('throws an error if the source file is not in the queries directory', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    await expect(
      sourceManager.loadFromConfigFile('/source.yml'),
    ).rejects.toThrowError(
      'Source file is not in the queries directory: /source.yml',
    )
  })

  it('loads the same source configuration file only once', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const connector = await sourceManager.loadFromConfigFile('source.yml')
    const connector2 = await sourceManager.loadFromConfigFile('source.yml')
    expect(connector).toBe(connector2)
  })

  it('loads different source configuration files separately', async () => {
    const sourceManager = new SourceManager('/path/to/queries')
    const connector = await sourceManager.loadFromConfigFile('source.yml')
    const connector2 = await sourceManager.loadFromConfigFile(
      'nestedSource/source.yml',
    )
    expect(connector).not.toBe(connector2)
  })
})
