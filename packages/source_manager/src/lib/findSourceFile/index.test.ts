import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { vi } from 'vitest'
import findSourceConfigFromQuery from '.'
import { QueryNotFoundError, SourceFileNotFoundError } from '../../types'
import mockFs from 'mock-fs'

const ROOT_FOLDER = 'path/to/queries'

// Mocks fs module
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  readdir: vi.fn(),
}))

describe('findQueryFile', () => {
  beforeEach(() => {
    mockFs({
      [ROOT_FOLDER]: {
        valid: {
          'source.yml': 'Source config file',
          'query.sql': 'Some query',
          nested: {
            'query.sql': 'Some nested query',
          },
        },
        invalid: {
          'query.sql': 'Some query without source',
        },
      },
    })
  })

  afterEach(() => {
    mockFs.restore()
    vi.restoreAllMocks()
  })

  it('finds the correct source config file from any query', async () => {
    const result = await findSourceConfigFromQuery({
      queriesDir: ROOT_FOLDER,
      query: 'valid/query',
    })
    const nestedResult = await findSourceConfigFromQuery({
      queriesDir: ROOT_FOLDER,
      query: 'valid/nested/query',
    })
    const sourcePath = `${ROOT_FOLDER}/valid/source.yml`
    expect(result).toEqual(sourcePath)
    expect(nestedResult).toEqual(sourcePath)
  })

  it('should throw a QueryNotFoundError if the .sql file does not exist', async () => {
    await expect(
      findSourceConfigFromQuery({
        queriesDir: ROOT_FOLDER,
        query: 'valid/nonexistent',
      }),
    ).rejects.toThrow(QueryNotFoundError)
  })

  it('should throw a SourceFileNotFoundError if the .yml file does not exist', async () => {
    await expect(
      findSourceConfigFromQuery({
        queriesDir: ROOT_FOLDER,
        query: 'invalid/query',
      }),
    ).rejects.toThrow(SourceFileNotFoundError)
  })
})