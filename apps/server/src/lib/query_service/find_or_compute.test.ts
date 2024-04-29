import TestConnector from '@latitude-data/test-connector'
import findOrCompute, { computeRelativeQueryPath } from './find_or_compute'
import fs from 'fs'
import mockFs from 'mock-fs'
import { QUERIES_DIR } from '$lib/server/sourceManager'
import { it, describe, beforeEach, afterEach, expect } from 'vitest'
import { vi } from 'vitest'

import type { CompiledQuery, QueryRequest } from '@latitude-data/base-connector'

const runQuerySpy = vi.fn()
const connector = new TestConnector(QUERIES_DIR, {
  onRunQuery: runQuerySpy,
})

vi.mock('$lib/server/sourceManager', async (importOriginal) => {
  return {
    ...((await importOriginal()) as Record<string, unknown>),
    default: {
      loadFromQuery: async () => {
        return {
          source: {
            compileQuery: (request: QueryRequest) =>
              connector.compileQuery(request),
            runCompiledQuery: (compiledQuery: CompiledQuery) =>
              connector.runCompiled(compiledQuery),
          },
          sourceFilePath: QUERIES_DIR,
        }
      },
    },
  }
})

describe('Query cache', () => {
  beforeEach(() => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': `
          type: test
          details:
            host: localhost
            port: 1234
        `,
      },
      '/tmp/.latitude': {},
    })
    vi.resetAllMocks()
  })

  afterEach(() => {
    mockFs.restore()
    runQuerySpy.mockClear()
  })

  it('Computes the same query only once', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, 'SELECT * FROM table')

    const queryPath = 'query'
    const queryParams = {}

    // First call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1) // No additional calls
  })

  it('Recomputes the query if force is true', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, 'SELECT * FROM table')

    const queryPath = 'query'
    const queryParams = {}

    // First call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ query: queryPath, queryParams, force: true })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Additional call
  })

  it('Computes different queries independently', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query1.sql`, 'SELECT * FROM table1')
    fs.writeFileSync(`${QUERIES_DIR}/query2.sql`, 'SELECT * FROM table2')

    const queryPath1 = 'query1'
    const queryPath2 = 'query2'
    const queryParams = {}

    // First call of query 1
    await findOrCompute({ query: queryPath1, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // First call of query 2
    await findOrCompute({ query: queryPath2, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again for query 2

    // Second calls
    await findOrCompute({ query: queryPath1, queryParams, force: false })
    await findOrCompute({ query: queryPath2, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // No additional calls
  })

  it('Computes the same query with different parameters independently', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `SELECT * FROM {param('foo')}`)

    const queryPath = 'query'
    const queryParams1 = { foo: 'bar1' }
    const queryParams2 = { foo: 'bar2' }

    // First call with params 1
    await findOrCompute({
      query: queryPath,
      queryParams: queryParams1,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // First call with params 2
    await findOrCompute({
      query: queryPath,
      queryParams: queryParams2,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again with different params

    // Second calls
    await findOrCompute({
      query: queryPath,
      queryParams: queryParams1,
      force: false,
    })
    await findOrCompute({
      query: queryPath,
      queryParams: queryParams2,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // No additional calls
  })

  it('Only caches the accessed parameters', async () => {
    fs.writeFileSync(
      `${QUERIES_DIR}/query.sql`,
      `SELECT * FROM {param('usedParam')}`,
    )

    const queryPath = 'query'
    const queryParams = { usedParam: 'bar', unusedParam: 'qux' }

    // First call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Changing the unused param
    queryParams.unusedParam = 'qux2'
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1) // No additional calls

    // Changing the used param
    queryParams.usedParam = 'bar2'
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again with different params
  })
})

describe('computeRelativeQueryPath', () => {
  it('should compute the relative query path correctly', () => {
    const sourcePath = `${QUERIES_DIR}/folder/source.yml`
    const queryPath = 'folder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('query.sql')
  })

  it('should compute the relative query path correctly if query is nested in subfolders', () => {
    const sourcePath = `${QUERIES_DIR}/folder/source.yml`
    const queryPath = 'folder/subfolder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('subfolder/query.sql')
  })

  it('should compute the relative query path correctly if query is in root directory', () => {
    const sourcePath = `${QUERIES_DIR}/source.yml`
    const queryPath = 'query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('query.sql')
  })

  it('should compute the relative query path correctly if source is in root directory and query is in subfolders', () => {
    const sourcePath = `${QUERIES_DIR}/source.yml`
    const queryPath = 'folder/subfolder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('folder/subfolder/query.sql')
  })
})
