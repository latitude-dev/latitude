import { expect, it, describe, afterEach } from 'vitest'
import mockFs from 'mock-fs'
import SourceManager from '@/manager'
import { ConnectorType } from '@/types'
import findAndMaterializeQueries from './findAndMaterializeQueries'
import { getStorageDriver } from '@latitude-data/storage-driver'
import { v4 as uuidv4 } from 'uuid'

const QUERIES_DIR = 'queries'
const MATERIALIZED_DIR = 'storage'
const materializableSql = () => `
{@config materialize = true} -- Random uuid: ${uuidv4()}
SELECT * FROM users
`
const cacheableMaterializableSql = (ttl: number = 3600) => `
{@config materialize = true} -- Random uuid: ${uuidv4()}
{@config ttl = ${ttl}}
SELECT * FROM users
`
const materializableFailingSql = () => `
{@config materialize = true} -- Random uuid: ${uuidv4()}
FAIL mocked error message
`

function buildManager(queriesDir: string) {
  const storage = getStorageDriver({ type: 'disk', path: MATERIALIZED_DIR })
  const manager = new SourceManager(queriesDir, { storage })
  return manager
}

mockFs({
  [QUERIES_DIR]: {},
  [MATERIALIZED_DIR]: {},
})

const manager = buildManager(QUERIES_DIR)

describe('findAndMaterializeQueries', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('should run materialize', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': materializableSql(),
        'source.yml': `type: ${ConnectorType.TestInternal}`,
        subdir: {
          'query2.sql': materializableSql(),
        },
      },
      [MATERIALIZED_DIR]: {},
    })
    const result = await findAndMaterializeQueries({ sourceManager: manager })
    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'query.sql',
          url: expect.any(String),
          cached: false,
          success: true,
          fileSize: expect.any(Number),
          rows: expect.any(Number),
          time: expect.any(Number),
        },
        {
          queryPath: 'subdir/query2.sql',
          url: expect.any(String),
          cached: false,
          success: true,
          fileSize: expect.any(Number),
          rows: expect.any(Number),
          time: expect.any(Number),
        },
      ],
    })
  })

  it('ignore non materializable queries', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': 'SELECT * FROM users',
        'source.yml': `type: ${ConnectorType.TestInternal}`,
        subdir: {
          'query2.sql': materializableSql(),
        },
      },
      [MATERIALIZED_DIR]: {},
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: [],
    })
    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'subdir/query2.sql',
          url: expect.any(String),
          cached: false,
          success: true,
          fileSize: expect.any(Number),
          rows: expect.any(Number),
          time: expect.any(Number),
        },
      ],
    })
  })

  it('fail when one of the selected queries is not materializable', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': 'SELECT * FROM users',
        'source.yml': `type: ${ConnectorType.TestInternal}`,
        subdir: {
          'query2.sql': materializableSql(),
        },
      },
      [MATERIALIZED_DIR]: {},
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: ['query', 'subdir/query2'],
    })

    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'query',
          cached: false,
          success: false,
          error: expect.objectContaining({
            message: 'Materialization is not enabled for this query',
          }),
        },
        {
          queryPath: 'subdir/query2',
          url: expect.any(String),
          cached: false,
          success: true,
          fileSize: expect.any(Number),
          rows: expect.any(Number),
          time: expect.any(Number),
        },
      ],
    })
  })

  it('returns a failed materialization when the query fails', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': materializableFailingSql(),
        'source.yml': `type: ${ConnectorType.TestInternal}`,
      },
      [MATERIALIZED_DIR]: {},
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: ['query'],
    })

    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'query',
          cached: false,
          success: false,
          error: expect.objectContaining({
            message: 'mocked error message',
          }),
        },
      ],
    })
  })

  it('Does not rematerialize cached queries', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': cacheableMaterializableSql(),
        'source.yml': `type: ${ConnectorType.TestInternal}`,
      },
      [MATERIALIZED_DIR]: {},
    })
    // Materialize the query
    await findAndMaterializeQueries({ sourceManager: manager })

    // Try to rematerialize the query while it's cached
    const result = await findAndMaterializeQueries({ sourceManager: manager })
    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'query.sql',
          url: expect.any(String),
          cached: true,
        },
      ],
    })
  })

  it('Queries without TTL have an infinite TTL', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': materializableSql(),
        'source.yml': `type: ${ConnectorType.TestInternal}`,
      },
      [MATERIALIZED_DIR]: {},
    })
    // Materialize the query
    await findAndMaterializeQueries({ sourceManager: manager })

    // Try to rematerialize the query
    const result = await findAndMaterializeQueries({ sourceManager: manager })
    expect(result).toEqual({
      totalTime: expect.any(Number),
      materializations: [
        {
          queryPath: 'query.sql',
          url: expect.any(String),
          cached: true,
        },
      ],
    })
  })
})
