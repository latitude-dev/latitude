import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MaterializedFileNotFoundError } from '../StorageDriver'
import DiskDriver from '@/materialize/drivers/disk/DiskDriver'
import SourceManager from '@/manager'
import fs from 'fs'

const BASE_PATH = 'static/.latutude/materialized_queries'

const manager = new SourceManager('queries', {
  materialize: {
    Klass: DiskDriver,
    config: { path: BASE_PATH },
  },
})
const driver = manager.materializeStorage

function mockFsAlwaysFindsFile() {
  vi.spyOn(fs, 'existsSync').mockImplementation(() => true)
}

describe('DiskDriver', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getUrl', () => {
    it('returns the same URL for queries with the same content hash and source path', async () => {
      mockFsAlwaysFindsFile()
      const sqlHash = 'foo'
      const url1 = await driver.getUrl({
        sqlHash,
        sourcePath: 'queries/postgresql',
        queryName: 'query1.sql',
      })
      const url2 = await driver.getUrl({
        sqlHash,
        sourcePath: 'queries/postgresql',
        queryName: 'nested/query2.sql',
      })

      expect(url1).toBe(url2)
    })

    it('returns different URLs for different source paths, independently of content hash', async () => {
      mockFsAlwaysFindsFile()
      const sqlHash = 'foo'
      const url1 = await driver.getUrl({
        sqlHash,
        sourcePath: 'queries/postgresql',
        queryName: 'query.sql',
      })
      const url2 = await driver.getUrl({
        sqlHash,
        sourcePath: 'queries/mysql',
        queryName: 'query.sql',
      })

      expect(url1).not.toBe(url2)
    })

    it('fails when the query is not materialized', async () => {
      await expect(
        driver.getUrl({
          sqlHash: 'foo',
          sourcePath: 'queries/postgresql',
          queryName: 'missing.sql',
        }),
      ).rejects.toThrowError(
        new MaterializedFileNotFoundError(
          "materialize query not found for: 'missing.sql'",
        ),
      )
    })

    it('do not fail when ignoreMissingFile is true', async () => {
      await expect(
        driver.getUrl({
          sqlHash: 'foo',
          sourcePath: 'queries/postgresql',
          queryName: 'missing.sql',
          ignoreMissingFile: true,
        }),
      ).resolves.not.toThrow()
    })
  })
})
