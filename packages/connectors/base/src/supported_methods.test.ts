import QueryResult from '@latitude-data/query_result'
import { DataType } from '@latitude-data/query_result'
import { type ResolvedParam, type CompiledQuery } from './types'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { CompileError } from '@latitude-data/sql-compiler'
import { BaseConnector } from './index'

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
    super('root')
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

describe('interpolate function', async () => {
  afterEach(clearQueries)

  it('interpolates a value directly into the query', async () => {
    const connector = new MockConnector()
    const sql = '{interpolate("foo")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('foo')
  })

  it('interpolates a value directly into the query even if it is null', async () => {
    const connector = new MockConnector()
    const sql = '{interpolate(null)}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('null')
  })

  it('interpolates the value of a variable into the query', async () => {
    const connector = new MockConnector()
    const sql = '{bar = "foo"}{interpolate(bar)}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('foo')
  })

  it('interpolates the value of an expression into the query', async () => {
    const connector = new MockConnector()
    const sql = '{interpolate(1 + 2)}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('3')
  })

  it('fails if called inside a logical expression', async () => {
    const connector = new MockConnector()
    const sql = "{result = {interpolate('foo')}} {result}"
    const queryPath = addFakeQuery(sql)

    const action = () => connector.run({ queryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('parse-error')
  })
})

describe('param function', async () => {
  afterEach(clearQueries)

  it('returns the value of a parameter', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: 'var' } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[var]]')
  })

  it('returns the default value when the parameter is not provided', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo", "default")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[default]]')
  })

  it('returns the given value even if it is null', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo", "default")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: null } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[null]]')
  })

  it('throws an error when the parameter is not provided and there is no default value', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    const action = () => connector.run({ queryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
  })

  it('parametrises the value when called as interpolation', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: 'var' } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[var]]')
  })

  it('returns the actual value when called inside a logical expression', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo") + 3}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: 2 } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[5]]')
  })
})

describe('unsafeParam function', async () => {
  afterEach(clearQueries)

  it('returns the value interpolated into the query', async () => {
    const connector = new MockConnector()
    const sql = '{unsafeParam("foo")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: 'var' } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('var')
  })

  it('uses default value if provided and no param is given', async () => {
    const connector = new MockConnector()
    const sql = '{unsafeParam("foo", "bar")}'
    const queryPath = addFakeQuery(sql)

    await connector.run({ queryPath, params: {} })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('bar')
  })

  it('fails if param is not provided', async () => {
    const connector = new MockConnector()
    const sql = '{unsafeParam("foo")}'
    const queryPath = addFakeQuery(sql)

    await expect(() =>
      connector.run({ queryPath, params: {} }),
    ).rejects.toThrow()
  })

  it('returns the given value even if it is null', async () => {
    const connector = new MockConnector()
    const sql = '{param("foo", "default")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: null } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('$[[null]]')
  })

  it('fails if value is null', async () => {
    const connector = new MockConnector()
    const sql = '{unsafeParam("foo")}'
    const queryPath = addFakeQuery(sql)
    await connector.run({ queryPath, params: { foo: null } })

    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('null')
  })
})

describe('ref function', async () => {
  afterEach(clearQueries)

  it('interpolates a subquery into the main query and wraps it in parentheses', async () => {
    const connector = new MockConnector()
    const mainQuery = 'main {ref("referenced_query")} end'
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    await connector.run({ queryPath: mainQueryPath })
    expect(ranQueries.length).toBe(1)
    expect(ranQueries[0]!.sql).toBe('main (ref) end')
  })

  it('fails if query does not exist', async () => {
    const connector = new MockConnector()
    const mainQuery = 'main {ref("referenced_query")} end'
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => connector.run({ queryPath: mainQueryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
  })

  it('fails if called inside a logical expression', async () => {
    const connector = new MockConnector()
    const mainQuery = "{result = {ref('referenced_query')}} {result}"
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => connector.run({ queryPath: mainQueryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('parse-error')
  })

  it('fails when there are cyclic references', async () => {
    const connector = new MockConnector()
    const query1 = 'main {ref("query2")} end'
    const query2 = 'main {ref("query1")} end'
    const query1Path = addFakeQuery(query1, 'query1')
    addFakeQuery(query2, 'query2')

    const action = () => connector.run({ queryPath: query1Path })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
  })
})

describe('runQuery function', async () => {
  afterEach(clearQueries)

  it('runs a subquery and returns it as a value', async () => {
    const connector = new MockConnector()
    const mainQuery = "{result = runQuery('referenced_query')} {result.length}"
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    await connector.run({ queryPath: mainQueryPath })
    expect(ranQueries.length).toBe(2)
    expect(ranQueries[0]!.sql).toBe('ref')
    expect(ranQueries[1]!.sql).toBe('$[[1]]')
  })

  it('fails if query does not exist', async () => {
    const connector = new MockConnector()
    const mainQuery =
      "{result = {runQuery('referenced_query')}} {result.length}"
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => connector.run({ queryPath: mainQueryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('parse-error')
  })

  it('fails if called as interpolation', async () => {
    const connector = new MockConnector()
    const mainQuery = "{runQuery('referenced_query')}"
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    const action = () => connector.run({ queryPath: mainQueryPath })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
  })

  it('fails when there are cyclic references', async () => {
    const connector = new MockConnector()
    const query1 = "{result = runQuery('query2')} {result.length}"
    const query2 = "{result = runQuery('query1')} {result.length}"
    const query1Path = addFakeQuery(query1, 'query1')
    addFakeQuery(query2, 'query2')

    const action = () => connector.run({ queryPath: query1Path })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
  })

  it('does not run the same query twice', async () => {
    const connector = new MockConnector()
    const mainQuery = "{ref('child1')}{ref('child2')}{ref('child3')}"
    const childQuery =
      "{@const result = runQuery('referenced_query')}{result.length}"
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(childQuery, 'child1')
    addFakeQuery(childQuery, 'child2')
    addFakeQuery(childQuery, 'child3')
    addFakeQuery(refQuery, 'referenced_query')

    await connector.run({ queryPath: mainQueryPath })
    expect(ranQueries.length).toBe(2)
    expect(ranQueries[0]!.sql).toBe('ref')
    expect(ranQueries[1]!.sql).toBe('($[[1]])($[[1]])($[[1]])')
  })
})
