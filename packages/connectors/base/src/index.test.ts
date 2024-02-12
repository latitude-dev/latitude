import { describe, it, expect } from 'vitest'
import { BaseConnector, CompiledQuery, KeyBasedCompiledParams, QueryParams, QueryRequest, QueryResult, SequentialCompiledParams, SyntaxError } from '.'

class MockConnector extends BaseConnector {
  private resolvedParams: KeyBasedCompiledParams = {}

  popParams = (): QueryParams => {
    const pop = {...this.resolvedParams}
    this.resolvedParams = {}
    return pop;
  }

  resolve(varName: string, value: unknown): string {
    // Mock implementation of resolve
    this.resolvedParams[varName] = value
    return `$[[${value}]]`
  }

  runQuery(request: CompiledQuery): Promise<QueryResult> {
    return new Promise((resolve) => {
      resolve({ rowCount: 0, fields: [], rows: [] })
    })
  }

  compileQuery(sql: string, params?: QueryParams): CompiledQuery {
    const compiledSql = this.compile(sql, params)
    const compiledParams = this.popParams()
    return { sql: compiledSql, params: compiledParams }
  }
}

describe('compile function', () => {
  it('returns SQL without parameters as is', () => {
    const connector = new MockConnector()
    const sql = 'SELECT * FROM table'
    const result = connector.compileQuery(sql)

    expect(result.sql).toBe(sql)
  })

  it('fails when a parameter is not provided', () => {
    const connector = new MockConnector()
    const sql = 'SELECT * FROM table WHERE column = {param("column")}'
    const params: QueryParams = {}
    const action = () => connector.compileQuery(sql, params)

    expect(action).toThrow(SyntaxError)
  })

  it('compiles SQL with simple parameters correctly', () => {
    const connector = new MockConnector()
    const sql = 'SELECT * FROM table WHERE column = {param("column", "default")}'
    const params = { column: 'value' }
    const result = connector.compileQuery(sql, params)

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
      const params = { column: left }
      const result = connector.compileQuery(sql, params)

      expect(result.sql).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it ('allows for simple logical operations', () => {
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
      const params = { column: left }
      const result = connector.compileQuery(sql, params)

      expect(result.sql).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it ('allows for simple comparison operations', () => {
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
      const params = { column: left }
      const result = connector.compileQuery(sql, params)

      expect(result.sql).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it ('allows for simple nullish coalescing operations', () => {
    const connector = new MockConnector()
    const operations = [
      [5, '??', 1, 5],
      [null, '??', 1, 1],
      [undefined, '??', 1, 1],
    ]

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const params = { column: left }
      const result = connector.compileQuery(sql, params)

      expect(result.sql).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it('allows conditional expressions', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {/if}`
    const result1 = connector.compileQuery(sql, { limit: 5 })
    const result2 = connector.compileQuery(sql, { limit: 0 })
    const result3 = connector.compileQuery(sql, { limit: undefined })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows else statements', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit", 0)} LIMIT {param("limit")} {:else} OFFSET {param("offset")} {/if}`
    const result1 = connector.compileQuery(sql, { limit: 5 })
    const result2 = connector.compileQuery(sql, { offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2.sql).toBe('SELECT * FROM table OFFSET $[[10]]')
  })

  it('allows nested conditional expressions', () => {
    const connector = new MockConnector()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {#if param("offset")} OFFSET {param("offset")} {/if} {/if}`
    const result1 = connector.compileQuery(sql, { limit: 5, offset: 10 })
    const result2 = connector.compileQuery(sql, { limit: 5, offset: 0 })
    const result3 = connector.compileQuery(sql, { limit: 0, offset: 10 })

    expect(result1.sql).toBe('SELECT * FROM table LIMIT $[[5]] OFFSET $[[10]]')
    expect(result2.sql).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result3.sql).toBe('SELECT * FROM table')
  })

  it('allows each loops', () => {
    const connector = new MockConnector()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {/each}`
    const params = { columns: ['column_1', 'column_2', 'column_3'] }
    const result = connector.compileQuery(sql, params)

    expect(result.sql).toBe('SELECT ' + params['columns'].map((column_name, index) => `$[[${index}]] AS $[[${column_name}]], `).join('').trim())
  })

  it('allows each else statements', () => {
    const connector = new MockConnector()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {:else} * {/each}`
    const result1 = connector.compileQuery(sql, { columns: ['column_1', 'column_2', 'column_3'] })
    const result2 = connector.compileQuery(sql, { columns: [] })

    expect(result1.sql).toBe('SELECT $[[0]] AS $[[column_1]], $[[1]] AS $[[column_2]], $[[2]] AS $[[column_3]],')
    expect(result2.sql).toBe('SELECT *')
  })

  it('allows defining constants', () => {
    const connector = new MockConnector()
    const sql1 = `SELECT * FROM table LIMIT {limit}`
    const sql2 = `{@const limit = 5} SELECT * FROM table LIMIT {limit}`

    const action1 = () => connector.compileQuery(sql1)
    expect(action1).toThrow(SyntaxError)

    const result2 = connector.compileQuery(sql2)
    expect(result2.sql).toBe(`SELECT * FROM table LIMIT $[[5]]`)
  })
})