import { expect, it, describe, afterEach } from 'vitest'
import mockFs from 'mock-fs'
import SourceManager from '@/manager'
import DiskDriver from '@/materialize/drivers/disk/DiskDriver'
import { ConnectorType } from '@/types'
import findAndMaterializeQueries from './findAndMaterializeQueries'

const QUERIES_DIR = 'queries'
const MATERIALIZED_DIR = 'materialized'
const MATERIALIZABLE_SQL = `
{@config materialize = true}
SELECT * FROM users
`
const CACHEABLE_MATERIALIZABLE_SQL = `
{@config materialize = true}
{@config ttl = 3600}
SELECT * FROM users
`
const MATERIALIZABLE_FAILING_SQL = `
{@config materialize = true}
FAIL mocked error message
`

function buildManager(queriesDir: string, materializedDir: string) {
  const manager = new SourceManager(queriesDir, {
    materialize: {
      Klass: DiskDriver,
      config: {
        path: materializedDir,
      },
    },
  })
  return manager
}

const manager = buildManager(QUERIES_DIR, MATERIALIZED_DIR)

describe('findAndMaterializeQueries', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('should run materialize', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': MATERIALIZABLE_SQL,
        'source.yml': `type: ${ConnectorType.TestInternal}`,
        subdir: {
          'query2.sql': MATERIALIZABLE_SQL,
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
          cached: false,
          success: true,
          fileSize: expect.any(Number),
          rows: expect.any(Number),
          time: expect.any(Number),
        },
        {
          queryPath: 'subdir/query2.sql',
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
          'query2.sql': MATERIALIZABLE_SQL,
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
          'query2.sql': MATERIALIZABLE_SQL,
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
            message: 'Query is not configured as materialized',
          }),
        },
        {
          queryPath: 'subdir/query2',
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
        'query.sql': MATERIALIZABLE_FAILING_SQL,
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
        'query.sql': CACHEABLE_MATERIALIZABLE_SQL,
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
          cached: true,
        },
      ],
    })
  })
})
