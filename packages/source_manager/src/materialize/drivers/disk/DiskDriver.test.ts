import mockFs from 'mock-fs'
import { describe, it, expect, beforeEach } from 'vitest'
import { buildStorageDriver, STORAGE_TYPES, StorageType } from '@/materialize'
import { MaterializedFileNotFoundError } from '../StorageDriver'

const BASE_PATH = 'static/.latutude/materialized_queries'
const POSTGRESQL_QUERY_PARQUET =
  '9243cff7f8807cf05319802bd203cc89e9234d8c146fe30846341fc96a729c37.parquet'
const MYSQL_QUERY_PARQUET =
  'ff3ac72c335f07efcc9b7a6d50fa3d093051c6fe1688e045bfa4fe1a6bf13e0d.parquet'
const POSTGRESQL_QUERY_METADATA =
  '9243cff7f8807cf05319802bd203cc89e9234d8c146fe30846341fc96a729c37-metadata.json'

const driver = buildStorageDriver({
  type: STORAGE_TYPES.disk as StorageType,
  config: { path: BASE_PATH },
})!

describe('DiskDriver', () => {
  beforeEach(() => {
    mockFs({
      [BASE_PATH]: {
        [POSTGRESQL_QUERY_PARQUET]: 'POSTGRESQL PARQUET FILE',
        [POSTGRESQL_QUERY_METADATA]:
          '{"materializedAt": "2021-01-01T00:00:00Z}',
        [MYSQL_QUERY_PARQUET]: 'MYSQL PARQUET FILE',
      },
    })
  })
  describe('getUrl', () => {
    it('returns a URL for a given SQL query', async () => {
      const url = await driver.getUrl({
        sql: 'SELECT * FROM users',
        queryPath: 'queries/postgresql',
        queryName: 'query.sql',
      })
      expect(url).toBe(`${BASE_PATH}/${POSTGRESQL_QUERY_PARQUET}`)
    })

    it('returns different URLs for different query path', async () => {
      const postgresqlFilename = await driver.getUrl({
        sql: 'SELECT * FROM users',
        queryPath: 'queries/postgresql',
        queryName: 'query.sql',
      })
      const mysqlFilename = await driver.getUrl({
        sql: 'SELECT * FROM users',
        queryPath: 'queries/mysql',
        queryName: 'query.sql',
      })

      expect(postgresqlFilename).not.toBe(mysqlFilename)
    })

    it('fails when the query is not materialized', async () => {
      await expect(
        driver.getUrl({
          sql: 'SELECT * FROM projects',
          queryPath: 'queries/postgresql',
          queryName: "'../missing.sql'",
        }),
      ).rejects.toThrowError(
        new MaterializedFileNotFoundError(
          "materialize query not found for: '../missing.sql'",
        ),
      )
    })
  })
})
