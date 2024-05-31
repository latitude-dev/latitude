import mockFs from 'mock-fs'
import { vi, it, describe, beforeEach, afterEach, expect } from 'vitest'
import sourceManager from '$lib/server/sourceManager'

import findOrCompute from './find_or_compute'
import { QUERIES_DIR } from '$lib/constants'

async function buildConnector(queryPath: string) {
  const source = await sourceManager.loadFromQuery(queryPath)

  if (!source['_connector']) {
    // `_connector` is a private property, so we need to call `compileQuery` to set it
    // This is a hack to avoid having to mock the connector
    await source.compileQuery({ queryPath, params: {} })
  }

  return source['_connector']
}

describe('Query cache', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    mockFs.restore()
  })

  it('Computes the same query only once', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query.sql': 'SELECT * FROM table',
      },
      '/tmp/.latitude': {},
    })
    const connector = await buildConnector('query')
    const queryPath = 'query'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call
    await findOrCompute({ query: queryPath, queryParams, force: false })

    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1) // No additional calls
  })

  it('Recomputes the query if force is true', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query.sql': 'SELECT * FROM table',
      },
      '/tmp/.latitude': {},
    })
    const connector = await buildConnector('query')
    const queryPath = 'query'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call
    await findOrCompute({ query: queryPath, queryParams, force: false })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // Second call
    await findOrCompute({ query: queryPath, queryParams, force: true })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Additional call
  })

  it('Computes different queries independently', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query1.sql': 'SELECT * FROM table1',
        'query2.sql': 'SELECT * FROM table2',
      },
      '/tmp/.latitude': {},
    })
    const connector = await buildConnector('query1')
    const queryPath1 = 'query1'
    const queryPath2 = 'query2'
    const queryParams = {}
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

    // First call of query 1
    await findOrCompute({
      query: queryPath1,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(1)

    // First call of query 2
    await findOrCompute({
      query: queryPath2,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // Called again for query 2

    // Second calls
    await findOrCompute({
      query: queryPath1,
      queryParams,
      force: false,
    })
    await findOrCompute({
      query: queryPath2,
      queryParams,
      force: false,
    })
    expect(runQuerySpy).toHaveBeenCalledTimes(2) // No additional calls
  })

  it('Computes the same query with different parameters independently', async () => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query.sql': "SELECT * FROM {param('foo')}",
      },
      '/tmp/.latitude': {},
    })

    const connector = await buildConnector('query')
    const queryPath = 'query'
    const queryParams1 = { foo: 'bar1' }
    const queryParams2 = { foo: 'bar2' }
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

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
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: test',
        'query.sql': "SELECT * FROM {param('usedParam')}",
      },
      '/tmp/.latitude': {},
    })
    const connector = await buildConnector('query')
    const queryPath = 'query'
    const queryParams = { usedParam: 'bar', unusedParam: 'qux' }
    const runQuerySpy = vi.spyOn(connector, 'runQuery')

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
