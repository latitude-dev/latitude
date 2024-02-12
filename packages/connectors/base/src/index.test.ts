import {
  BaseConnector,
  CompiledQuery,
  KeyBasedCompiledParams,
  QueryParams,
  QueryResult,
  SyntaxError,
} from './index.js'
import { describe, it, expect, afterEach } from 'vitest'
import mockFs from 'mock-fs'

class MockConnector extends BaseConnector {
  private resolvedParams: KeyBasedCompiledParams = {}

  constructor() {
    super('root')
  }

  popParams = (): QueryParams => {
    const pop = { ...this.resolvedParams }
    this.resolvedParams = {}
    return pop
  }

  resolve(varName: string, value: unknown): string {
    // Mock implementation of resolve
    this.resolvedParams[varName] = value
    return `$[[${value}]]`
  }

  runQuery(_: CompiledQuery): Promise<QueryResult> {
    return new Promise((resolve) => {
      resolve({ rowCount: 0, fields: [], rows: [] })
    })
  }

  compileQuery(sql: string, params?: QueryParams): CompiledQuery {
    // @ts-ignore
    const compiledSql = this.compile(sql, params)
    const compiledParams = this.popParams()
    return { sql: compiledSql, params: compiledParams }
  }

  private fakeQueries = {}

  addFakeQuery(query: string, path?: string): string {
    const localPath = path || `query_${Object.keys(this.fakeQueries).length}`
    const fullPath = `root/${localPath}.sql`

    // Add the new query to the fakeQueries object, adding the path as the key as new nested objects
    const addQueryToFakeQueries = (
      fakeQueries: Record<string, unknown>,
      subPath: string,
      query: string,
    ): Record<string, unknown> => {
      const pathParts = subPath.split('/')
      if (pathParts.length === 1) {
        fakeQueries[subPath] = query
        return fakeQueries
      }
      const [first, ...rest] = pathParts
      return {
        ...fakeQueries,
        [first as string]: addQueryToFakeQueries(
          (fakeQueries[first as string] || {}) as Record<string, unknown>,
          rest.join('/'),
          query,
        ),
      }
    }

    this.fakeQueries = addQueryToFakeQueries(this.fakeQueries, fullPath, query)
    mockFs(this.fakeQueries)
    return fullPath
  }
}

describe('compile function', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('returns SQL without parameters as is', () => {
    const connector = new MockConnector()
    const sql = 'SELECT * FROM table'
    const queryPath = connector.addFakeQuery(sql)
    const result = connector.compileQuery(queryPath)

    expect(result.sql).toBe(sql)
  })

  it('fails when a parameter is not provided', () => {
    const connector = new MockConnector()
    const sql = 'SELECT * FROM table WHERE column = {param("column")}'
    const queryPath = connector.addFakeQuery(sql)
    const params: QueryParams = {}
    const action = () => connector.compileQuery(queryPath, params)

    expect(action).toThrow(SyntaxError)
  })

  it('compiles SQL with simple parameters correctly', () => {
    const connector = new MockConnector()
    const sql =
      'SELECT * FROM table WHERE column = {param("column", "default")}'
    const queryPath = connector.addFakeQuery(sql)
    const params = { column: 'value' }
    const result = connector.compileQuery(queryPath, params)

    expect(result.sql).toBe('SELECT * FROM table WHERE column = $[[value]]')
  })

  it('allows for simple arithmetic operations', () => {
    const connector = new MockConnector()
    const operations = [
      [5, '+', 1, 6],
      [5, '-', 1, 4],
      [5, '*', 2, 10],
      [5, '/', 2, 2.5],
      [5, '%', 2, 1],
    ]

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = connector.addFakeQuery(sql)
      const params = { column: left }
      const result = connector.compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    })
  })

  it('allows for simple logical operations', () => {
    const connector = new MockConnector()
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

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = connector.addFakeQuery(sql)
      const params = { column: left }
      const result = connector.compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    })
  })

  it('allows for simple comparison operations', () => {
    const connector = new MockConnector()
    const operations = [
      [5, '>', 1, true],
      [5, '>=', 5, true],
      [5, '<', 10, true],
      [5, '<=', 5, true],
      [5, '==', 5, true],
      [5, '!=', 5, false],
    ]

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = connector.addFakeQuery(sql)
      const params = { column: left }
      const result = connector.compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    })
  })

  it('allows for simple nullish coalescing operations', () => {
    const connector = new MockConnector()
    const operations = [
      [5, '??', 1, 5],
      [null, '??', 1, 1],
      [undefined, '??', 1, 1],
    ]

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const queryPath = connector.addFakeQuery(sql)
      const params = { column: left }
      const result = connector.compileQuery(queryPath, params)

      expect(result.sql).toBe(
        `SELECT * FROM table WHERE column = $[[${expected}]]`,
      )
    })
  })

  it('allows conditional expressions', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {/if}`
    const queryPath = connector.addFakeQuery(sql)
    const result1 = connector.compileQuery(queryPath, { limit: 5 })
    const result2 = connector.compileQuery(queryPath, { limit: 0 })
    const result3 = connector.compileQuery(queryPath, { limit: undefined })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows else statements', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit", 0)} LIMIT {param("limit")} {:else} OFFSET {param("offset")} {/if}`
    const queryPath = connector.addFakeQuery(sql)
    const result1 = connector.compileQuery(queryPath, { limit: 5 })
    const result2 = connector.compileQuery(queryPath, { offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table OFFSET $[[10]]')
  })

  it('allows nested conditional expressions', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {#if param("offset")} OFFSET {param("offset")} {/if} {/if}`
    const queryPath = connector.addFakeQuery(sql)
    const result1 = connector.compileQuery(queryPath, { limit: 5, offset: 10 })
    const result2 = connector.compileQuery(queryPath, { limit: 5, offset: 0 })
    const result3 = connector.compileQuery(queryPath, { limit: 0, offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]] OFFSET $[[10]]')
    expect(result2.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows each loops', () => {
    const connector = new MockConnector()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {/each}`
    const queryPath = connector.addFakeQuery(sql)
    const params = { columns: ['column_1', 'column_2', 'column_3'] }
    const result = connector.compileQuery(queryPath, params)

    expect(result.sql).toBe(
      'SELECT ' +
        params['columns']
          .map((column_name, index) => `$[[${index}]] AS $[[${column_name}]], `)
          .join('')
          .trim(),
    )
  })

  it('allows each else statements', () => {
    const connector = new MockConnector()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {:else} * {/each}`
    const queryPath = connector.addFakeQuery(sql)
    const result1 = connector.compileQuery(queryPath, {
      columns: ['column_1', 'column_2', 'column_3'],
    })
    const result2 = connector.compileQuery(queryPath, { columns: [] })

    expect(result1.sql).toBe(
      'SELECT $[[0]] AS $[[column_1]], $[[1]] AS $[[column_2]], $[[2]] AS $[[column_3]],',
    )
    expect(result2.sql).toBe('SELECT *')
  })

  it('allows defining constants', () => {
    const connector = new MockConnector()
    const sql1 = `SELECT * FROM table LIMIT {limit}`
    const sql2 = `{@const limit = 5} SELECT * FROM table LIMIT {limit}`
    const queryPath1 = connector.addFakeQuery(sql1)
    const queryPath2 = connector.addFakeQuery(sql2)

    const action1 = () => connector.compileQuery(queryPath1)
    expect(action1).toThrow(SyntaxError)

    const result2 = connector.compileQuery(queryPath2)
    expect(result2.sql).toBe(`SELECT * FROM table LIMIT $[[5]]`)
  })

  it('can interpolate different queries', () => {
    const connector = new MockConnector()
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const refQuery = `SELECT * FROM column`
    const mainQueryPath = connector.addFakeQuery(mainQuery)
    connector.addFakeQuery(refQuery, 'referenced_query')

    const result = connector.compileQuery(mainQueryPath)
    expect(result.sql).toBe(`SELECT id FROM (SELECT * FROM column)`)
  })

  it('can interpolate queries from different subdirectories', () => {
    const connector = new MockConnector()
    const parentQuery = `SELECT id FROM {ref("child/query")}`
    const childQuery = `SELECT * FROM column`
    const parentQueryPath = connector.addFakeQuery(parentQuery, 'parent/query')
    connector.addFakeQuery(childQuery, 'child/query')

    const result = connector.compileQuery(parentQueryPath)
    expect(result.sql).toBe(`SELECT id FROM (SELECT * FROM column)`)
  })

  it('fails when referencing a non-existing query', () => {
    const connector = new MockConnector()
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const mainQueryPath = connector.addFakeQuery(mainQuery)

    const action = () => connector.compileQuery(mainQueryPath)
    expect(action).toThrow(SyntaxError)
  })

  it('fails when there are cyclic references', () => {
    const connector = new MockConnector()
    const mainQuery = `SELECT id FROM {ref("referenced_query")}`
    const refQuery = `SELECT * FROM {ref("main_query")}`
    const mainQueryPath = connector.addFakeQuery(mainQuery, 'main_query')
    connector.addFakeQuery(refQuery, 'referenced_query')

    const action = () => connector.compileQuery(mainQueryPath)
    expect(action).toThrow(SyntaxError)
  })
})
