import { describe, it, expect, afterEach, vi } from 'vitest'
import { CompileError } from '@latitude-data/sql-compiler'
import QueryResult from '@latitude-data/query_result'
import { DataType } from '@latitude-data/query_result'
import { type ResolvedParam, type CompiledQuery } from './types'
import { BaseConnector } from './index'
import { createDummySource } from '@/tests/helper'

const source = createDummySource()

vi.mock('fs', (importOriginal) => ({
  ...importOriginal(),
  existsSync: () => true,
  readFileSync: (path: unknown) => {
    return fakeQueries[(path as string).split('/').pop()!]
  },
}))

const fakeQueries: Record<string, string> = {}
const addFakeQuery = (sql: string, queryPath?: string) => {
  queryPath = queryPath || `query_${Object.keys(fakeQueries).length}`
  const fullQueryPath = queryPath.endsWith('.sql')
    ? queryPath
    : `${queryPath}.sql`
  fakeQueries[fullQueryPath] = sql

  return queryPath
}

const ranQueries: CompiledQuery[] = []
class MockConnector extends BaseConnector {
  constructor() {
    super({ source, connectionParams: {} })
  }

  protected resolve(value: unknown, _: number): ResolvedParam {
    return { value, resolvedAs: `$[[${value}]]` }
  }

  protected async runQuery(request: CompiledQuery): Promise<QueryResult> {
    ranQueries.push(request)
    return new QueryResult({
      rowCount: 1,
      fields: [
        {
          name: 'var',
          type: DataType.String,
        },
      ],
      rows: [['foo']],
    })
  }
}

const clearQueries = () => {
  Object.keys(fakeQueries).forEach((key) => delete fakeQueries[key])
  vi.clearAllMocks()
  ranQueries.length = 0
}

const getExpectedError = async <T>(
  action: () => Promise<unknown>,
  errorClass: new () => T,
): Promise<T> => {
  try {
    await action()
  } catch (err) {
    expect(err).toBeInstanceOf(errorClass)
    return err as T
  }
  throw new Error('Expected an error to be thrown')
}

describe('queryConfig', async () => {
  afterEach(clearQueries)

  it('sets an option to a value during query compilation', async () => {
    const connector = new MockConnector()
    const sql = '{@config ttl = 420}'
    const queryPath = addFakeQuery(sql)

    const compiledQuery = await connector.compileQuery({ queryPath })
    expect(compiledQuery.config.ttl).toBe(420)
  })

  it('cannot set the same option twice', async () => {
    const connector = new MockConnector()
    const sql = '{@config ttl = 420}\n{@config ttl = 421}'
    const queryPath = addFakeQuery(sql)

    const action = () => connector.compileQuery({ queryPath })

    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('config-definition-failed')
  })

  it('ignores configurations from referenced queries', async () => {
    const connector = new MockConnector()
    const refQuerySql = '{@config ttl = 420}'
    const refQueryPath = addFakeQuery(refQuerySql, 'ref_query.sql')

    const mainQuerySql = `{ref('${refQueryPath}')}`
    const queryPath = addFakeQuery(mainQuerySql)

    const compiledQuery = await connector.compileQuery({ queryPath })
    expect(compiledQuery.config.ttl).toBeUndefined()
  })

  it('ignores configurations from ran queries', async () => {
    const connector = new MockConnector()
    const ranQuerySql = '{@config ttl = 420}'
    const ranQueryPath = addFakeQuery(ranQuerySql, 'ref_query.sql')

    const mainQuerySql = `{results = runQuery('${ranQueryPath}')}`
    const queryPath = addFakeQuery(mainQuerySql)

    const compiledQuery = await connector.compileQuery({ queryPath })
    expect(compiledQuery.config.ttl).toBeUndefined()
  })

  it('can set unknown options', async () => {
    const connector = new MockConnector()
    const sql = '{@config foo = "bar"}'
    const queryPath = addFakeQuery(sql)

    const compiledQuery = await connector.compileQuery({ queryPath })

    // @ts-expect-error foo is not a QueryConfig option registered in the linter
    expect(compiledQuery.config.foo).toBe('bar')
  })
})

describe('accessedParams', async () => {
  afterEach(clearQueries)

  it('records all accessed params', async () => {
    const connector = new MockConnector()
    const sql = `SELECT {param('foo')} FROM {param('bar')}`
    const queryPath = addFakeQuery(sql)

    const params = { foo: 'foo', bar: 'bar', baz: 'baz', qux: 'qux' }

    const compiledQuery = await connector.compileQuery({ queryPath, params })
    expect(compiledQuery.accessedParams['foo']).toBe('foo')
    expect(compiledQuery.accessedParams['bar']).toBe('bar')
    expect(compiledQuery.accessedParams['baz']).toBeUndefined()
    expect(compiledQuery.accessedParams['qux']).toBeUndefined()
  })

  it('records all accessed params in nested queries', async () => {
    const connector = new MockConnector()

    const nestedQuerySql = `SELECT {param('par1')} FROM {param('par2')}`
    const nestedQueryPath = addFakeQuery(nestedQuerySql)

    const sql = `SELECT {param('par3')} FROM {ref('${nestedQueryPath}')}`
    const queryPath = addFakeQuery(sql)

    const params = { par1: 1, par2: 2, par3: 3, par4: 4 }

    const compiledQuery = await connector.compileQuery({ queryPath, params })
    expect(compiledQuery.accessedParams['par1']).toBe(1)
    expect(compiledQuery.accessedParams['par2']).toBe(2)
    expect(compiledQuery.accessedParams['par3']).toBe(3)
    expect(compiledQuery.accessedParams['par4']).toBeUndefined()
  })

  it('allows accessing the same param multiple times', async () => {
    const connector = new MockConnector()
    const sql = `SELECT {param('foo')} FROM {param('foo')}`
    const queryPath = addFakeQuery(sql)

    const params = { foo: 'foo' }

    const compiledQuery = await connector.compileQuery({ queryPath, params })
    expect(compiledQuery.accessedParams).toEqual({ foo: 'foo' })
  })
})
