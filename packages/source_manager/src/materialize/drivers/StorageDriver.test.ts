import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'fs'
import mockFs from 'mock-fs'
import SourceManager from '@/manager'
import DiskDriver from '@/materialize/drivers/disk/DiskDriver'
import {
  BatchedQueryOptions,
  BatchedRow,
  CompiledQuery,
  ConnectorType,
} from '@/types'
import {
  FakeUser,
  MATERIALIZED_DIR,
  QUERIES_DIR,
  createFakeUserDB,
} from '@/tests/helper'
import { ParquetReader } from '@dsnp/parquetjs'

const fakeUsers = createFakeUserDB({ amount: 15 })

const FAKE_QUERIES_DIR = '/queries'
const FAKE_MATERIALIZED_DIR = '/materialized'
function buildFs(sql: string) {
  mockFs({
    [FAKE_QUERIES_DIR]: {
      'query.sql': sql,
      'source.yml': `type: ${ConnectorType.TestInternal}`,
    },
    [FAKE_MATERIALIZED_DIR]: {},
  })
}

function getDriver(queriesDir: string, materializedDir: string) {
  const manager = new SourceManager(queriesDir, {
    materialize: {
      Klass: DiskDriver,
      config: {
        path: materializedDir,
      },
    },
  })
  return manager.materializeStorage
}

const fields = fakeUsers.fields
const users = fakeUsers.rows as FakeUser[]

function usersInBatch(options: BatchedQueryOptions) {
  const groups: FakeUser[][] = []
  for (let i = 0; i < users.length; i += options.batchSize) {
    groups.push(users.slice(i, i + options.batchSize))
  }
  return groups
}

vi.mock('@/testConnector', async (importOriginal) => {
  const original = (await importOriginal()) as typeof import('@/testConnector')
  return {
    default: class extends original.default {
      async batchQuery(_c: CompiledQuery, options: BatchedQueryOptions) {
        const groups = usersInBatch(options)
        for (let i = 0; i < groups.length; i += 1) {
          const lastBatch = i === groups.length - 1
          await options.onBatch({ rows: groups[i]!, fields, lastBatch })
        }
      }
    },
  }
})

describe('writeParquet', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('should write a parquet file', async () => {
    const driver = getDriver(QUERIES_DIR, MATERIALIZED_DIR)
    const result = await driver.writeParquet({
      queryPath: 'materialize/query.sql',
      params: {},
      batchSize: 5,
    })

    const filePath = result.filePath
    expect(fs.existsSync(filePath)).toBe(true)

    const file = fs.readFileSync(filePath)
    const reader = await ParquetReader.openBuffer(file)
    const cursor = reader.getCursor()
    let record = null
    const records: BatchedRow[] = []

    while ((record = await cursor.next())) {
      records.push(record as BatchedRow)
    }

    const emails = fakeUsers.rows.map((r: BatchedRow) => r.email)
    const emailsInParquet = records.map((r: BatchedRow) => r.email)
    expect(emailsInParquet).toEqual(emails)
  })

  it('fails when query is not configured as materialized', async () => {
    const driver = getDriver(FAKE_QUERIES_DIR, FAKE_MATERIALIZED_DIR)
    buildFs('SELECT * FROM users')
    await expect(
      driver.writeParquet({
        queryPath: 'query.sql',
        params: {},
        batchSize: 10,
      }),
    ).rejects.toThrow('Query is not configured as materialized')
  })
})
