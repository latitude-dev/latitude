import { vi, expect, it, describe, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import mockFs from 'mock-fs'
import SourceManager from '@/manager'
import DiskDriver from '@/materialize/drivers/disk/DiskDriver'
import { ConnectorType } from '@/types'
import findAndMaterializeQueries from './findAndMaterializeQueries'
import { WriteParquetParams } from '@/materialize/drivers/StorageDriver'

const QUERIES_DIR = '/queries'
const MATERIALIZED_DIR = '/materialized'
const MATERIALIZABLE_SQL = `
{@config materialize = true}
SELECT * FROM users
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

vi.mock('@/materialize/drivers/StorageDriver', async (importOriginal) => {
  const original =
    (await importOriginal()) as typeof import('@/materialize/drivers/StorageDriver')
  return {
    ...original,
    // @ts-expect-error - Mocking abstract class
    StorageDriver: class extends original.StorageDriver {
      async writeParquet({ queryPath, params }: WriteParquetParams) {
        const source = await manager.loadFromQuery(queryPath)
        const { sqlHash } = await source.getMetadataFromQuery(queryPath)
        const compiled = await source.compileQuery({ queryPath, params })

        // Stupid mock parquet that write the compiled query to a file
        const filePath = path.join(MATERIALIZED_DIR, `${sqlHash}.parquet`)
        fs.writeFileSync(filePath, JSON.stringify(compiled))

        return Promise.resolve({ filePath, queryRows: 0 })
      }
    },
  }
})
describe('findAndMaterializeQueries', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('should run writeParquet', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'query.sql': MATERIALIZABLE_SQL,
        'source.yml': `type: ${ConnectorType.TestInternal}`,
        subdir: {
          'query2.sql': MATERIALIZABLE_SQL,
        },
      },
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: [],
    })
    expect(result).toEqual({
      batchSize: 4096,
      totalTime: expect.any(String),
      successful: true,
      queriesInfo: [
        {
          file: expect.any(String),
          fileSize: '69 Bytes',
          query: 'query.sql',
          queryRows: '0 rows',
          time: expect.any(String),
        },
        {
          file: expect.any(String),
          fileSize: '69 Bytes',
          query: 'subdir/query2.sql',
          queryRows: '0 rows',
          time: expect.any(String),
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
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: [],
    })
    expect(result).toEqual({
      successful: true,
      batchSize: 4096,
      totalTime: expect.any(String),
      queriesInfo: [
        {
          file: expect.any(String),
          fileSize: '69 Bytes',
          query: 'subdir/query2.sql',
          queryRows: '0 rows',
          time: expect.any(String),
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
    })
    const result = await findAndMaterializeQueries({
      sourceManager: manager,
      selectedQueries: ['query', 'subdir/query2'],
    })

    expect(result).toEqual({
      successful: false,
      batchSize: 4096,
      totalTime: expect.any(String),
      queriesInfo: [],
    })
  })
})
