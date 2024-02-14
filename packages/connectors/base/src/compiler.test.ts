import {
  type ResolvedParam,
  type CompiledQuery,
  type QueryParams,
  type QueryResult,
  DataType,
} from './types'
import { compile, SyntaxError } from './compiler'
import { describe, it, expect, afterEach } from 'vitest'

const fakeQueries: Record<string, string> = {}
const addFakeQuery = (sql: string, queryPath?: string) => {
  queryPath = queryPath || `query_${Object.keys(fakeQueries).length}`
  queryPath = queryPath.endsWith('.sql') ? queryPath : `${queryPath}.sql`
  fakeQueries[queryPath] = sql
  return queryPath
}
const clearFakeQueries = () => {
  Object.keys(fakeQueries).forEach((key) => delete fakeQueries[key])
}

const compilerFns = {
  resolveFn: (
    name: string | undefined,
    value: unknown,
    resolvedParams: ResolvedParam[],
  ): ResolvedParam => {
    return { name, value, resolvedAs: `$[[${value}]]` }
  },
  readQueryFn: (queryPath: string): string | undefined => {
    return fakeQueries[queryPath]
  },
  runQueryFn: async (_: CompiledQuery): Promise<QueryResult> => {
    return {
      rowCount: 1,
      fields: [
        {
          name: 'var',
          type: DataType.String,
        },
      ],
      rows: [['foo']],
    }
  },
}

const compileQuery = (queryPath: string, params: QueryParams = {}) => {
  return compile({
    queryRequest: { queryPath, params },
    ...compilerFns,
  })
}

describe('compile function', async () => {
  afterEach(() => {
    clearFakeQueries()
  })

  it('returns SQL without parameters as is', async () => {
    const sql = 'SELECT * FROM table'
    const queryPath = addFakeQuery(sql)
    const result = await compile({
      queryRequest: { queryPath },
      ...compilerFns,
    })

    expect(result.sql).toBe(sql)
  })

  it('fails when a parameter is not provided', async () => {
    const sql = 'SELECT * FROM table WHERE column = {param("column")}'
    const queryPath = addFakeQuery(sql)
    const params: QueryParams = {}
    const action = () => compileQuery(queryPath, params)

    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('compiles SQL with simple parameters correctly', async () => {
    const sql =
      'SELECT * FROM table WHERE column = {param("column", "default")}'
    const queryPath = addFakeQuery(sql)
    const params = { column: 'value' }
    const result = await compileQuery(queryPath, params)

    expect(result.sql).toBe('SELECT * FROM table WHERE column = $[[value]]')
  })

  it('allows for simple arithmetic operations', async () => {
    const operations = [
      [5, '+', 1, 6],
      [5, '-', 1, 4],
      [5, '*', 2, 10],
      [5, '/', 2, 2.5],
      [5, '%', 2, 1],
    ]

    for (const [left, operator, right, expected] of operations) {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = addFakeQuery(sql)
      const params = { column: left }
      const result = await compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    }
  })

  it('allows for simple logical operations', async () => {
    const operations = [
      [true, '&&', true, true],
      [true, '&&', false, false],
      [false, '&&', true, false],
      [false, '&&', false, false],
      [true, '||', true, true],
      [true, '||', false, true],
      [false, '||', true, true],
      [false, '||', false, false],
    ]

    for (const [left, operator, right, expected] of operations) {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = addFakeQuery(sql)
      const params = { column: left }
      const result = await compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    }
  })

  it('allows for simple comparison operations', async () => {
    const operations = [
      [5, '>', 1, true],
      [5, '>=', 5, true],
      [5, '<', 10, true],
      [5, '<=', 5, true],
      [5, '==', 5, true],
      [5, '!=', 5, false],
    ]

    for (const [left, operator, right, expected] of operations) {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = addFakeQuery(sql)
      const params = { column: left }
      const result = await compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    }
  })

  it('allows for simple nullish coalescing operations', async () => {
    const operations = [
      [5, '??', 1, 5],
      [null, '??', 1, 1],
      [undefined, '??', 1, 1],
    ]

    for (const [left, operator, right, expected] of operations) {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = addFakeQuery(sql)
      const params = { column: left }
      const result = await compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    }
  })

  it('allows conditional expressions', async () => {
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {/if}`
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { limit: 5 })
    const result2 = await compileQuery(queryPath, { limit: 0 })
    const result3 = await compileQuery(queryPath, { limit: undefined })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows else statements', async () => {
    const sql = `SELECT * FROM table {#if param("limit", 0)} LIMIT {param("limit")} {:else} OFFSET {param("offset")} {/if}`
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { limit: 5 })
    const result2 = await compileQuery(queryPath, { offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table OFFSET $[[10]]')
  })

  it('allows nested conditional expressions', async () => {
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {#if param("offset")} OFFSET {param("offset")} {/if} {/if}`
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { limit: 5, offset: 10 })
    const result2 = await compileQuery(queryPath, { limit: 5, offset: 0 })
    const result3 = await compileQuery(queryPath, { limit: 0, offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]] OFFSET $[[10]]')
    expect(result2.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows each loops', async () => {
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {/each}`
    const queryPath = addFakeQuery(sql)
    const params = { columns: ['column_1', 'column_2', 'column_3'] }
    const result = await compileQuery(queryPath, params)

    expect(result.sql).toBe(
      'SELECT ' +
        params['columns']
          .map((column_name, index) => `$[[${index}]] AS $[[${column_name}]], `)
          .join('')
          .trim(),
    )
  })

  it('allows each else statements', async () => {
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {:else} * {/each}`
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, {
      columns: ['column_1', 'column_2', 'column_3'],
    })
    const result2 = await compileQuery(queryPath, { columns: [] })

    expect(result1.sql).toBe(
      'SELECT $[[0]] AS $[[column_1]], $[[1]] AS $[[column_2]], $[[2]] AS $[[column_3]],',
    )
    expect(result2.sql).toBe('SELECT *')
  })

  it('allows defining constants', async () => {
    const sql1 = `SELECT * FROM table LIMIT {limit}`
    const sql2 = `{@const limit = 5} SELECT * FROM table LIMIT {limit}`
    const queryPath1 = addFakeQuery(sql1)
    const queryPath2 = addFakeQuery(sql2)

    const action1 = () => compileQuery(queryPath1)
    await expect(action1()).rejects.toThrow(SyntaxError)

    const result2 = await compileQuery(queryPath2)
    expect(result2.sql).toBe(`SELECT * FROM table LIMIT $[[5]]`)
  })

  it('can interpolate different queries', async () => {
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const refQuery = `SELECT * FROM column`
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    const result = await compileQuery(mainQueryPath)
    expect(result.sql).toBe(`SELECT id FROM (SELECT * FROM column)`)
  })

  it('can interpolate queries from different subdirectories', async () => {
    const parentQuery = `SELECT id FROM {ref("child/query")}`
    const childQuery = `SELECT * FROM column`
    const parentQueryPath = addFakeQuery(parentQuery, 'parent/query')
    addFakeQuery(childQuery, 'child/query')

    const result = await compileQuery(parentQueryPath)
    expect(result.sql).toBe(`SELECT id FROM (SELECT * FROM column)`)
  })

  it('fails when referencing a non-existing query', async () => {
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('fails when there are cyclic references', async () => {
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const refQuery = `SELECT * FROM {ref("main_query")}`
    const mainQueryPath = addFakeQuery(mainQuery, 'main_query')
    addFakeQuery(refQuery, 'referenced_query')

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })
})
