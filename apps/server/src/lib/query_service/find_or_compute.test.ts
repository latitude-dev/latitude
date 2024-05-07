import fs from 'fs'
import mockFs from 'mock-fs'
import { vi, it, describe, beforeEach, afterEach, expect } from 'vitest'
import { Source, SourceManager } from '@latitude-data/source-manager'
import TestConnector from '@latitude-data/test-connector'

import { QUERIES_DIR } from '$lib/server/sourceManager'
import findOrCompute from './find_or_compute'

const sourceManager = new SourceManager(QUERIES_DIR)
const source = new Source({
  path: QUERIES_DIR,
  schema: { type: 'test' },
  sourceManager,
})
const connector = new TestConnector({
  source,
  connectionParams: { fail: false },
})
source.setConnector(connector)

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
    vi.restoreAllMocks()
  })

  afterEach(() => {
    mockFs.restore()
  })

  it('Computes the same query only once', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, 'SELECT * FROM table')
    const queryPath = 'query'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call
    await findOrCompute({ source, query: queryPath, queryParams, force: false })

    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ source, query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1) // No additional calls
  })

  it('Recomputes the query if force is true', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, 'SELECT * FROM table')

    const queryPath = 'query'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call
    await findOrCompute({ source, query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ source, query: queryPath, queryParams, force: true })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Additional call
  })

  it('Computes different queries independently', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query1.sql`, 'SELECT * FROM table1')
    fs.writeFileSync(`${QUERIES_DIR}/query2.sql`, 'SELECT * FROM table2')

    const queryPath1 = 'query1'
    const queryPath2 = 'query2'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call of query 1
    await findOrCompute({
      source,
      query: queryPath1,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // First call of query 2
    await findOrCompute({
      source,
      query: queryPath2,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again for query 2

    // Second calls
    await findOrCompute({
      source,
      query: queryPath1,
      queryParams,
      force: false,
    })
    await findOrCompute({
      source,
      query: queryPath2,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // No additional calls
  })

  it('Computes the same query with different parameters independently', async () => {
    fs.writeFileSync(`${QUERIES_DIR}/query.sql`, `SELECT * FROM {param('foo')}`)

    const queryPath = 'query'
    const queryParams1 = { foo: 'bar1' }
    const queryParams2 = { foo: 'bar2' }
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call with params 1
    await findOrCompute({
      source,
      query: queryPath,
      queryParams: queryParams1,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // First call with params 2
    await findOrCompute({
      source,
      query: queryPath,
      queryParams: queryParams2,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again with different params

    // Second calls
    await findOrCompute({
      source,
      query: queryPath,
      queryParams: queryParams1,
      force: false,
    })
    await findOrCompute({
      source,
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
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call
    await findOrCompute({ source, query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Changing the unused param
    queryParams.unusedParam = 'qux2'
    await findOrCompute({ source, query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1) // No additional calls

    // Changing the used param
    queryParams.usedParam = 'bar2'
    await findOrCompute({ source, query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again with different params
  })
})
