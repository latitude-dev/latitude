import { describe, it, expect } from 'vitest'
import { compile, SyntaxError } from './compile'
import { BaseAdapter, QueryParams } from '.'

class MockAdapter extends BaseAdapter {
  private params: QueryParams = {}

  getParams = (): QueryParams => this.params

  resolve(varName: string, value: unknown): string {
    // Mock implementation of resolve
    this.params[varName] = value
    return `$[[${value}]]`
  }
}

describe('compile function', () => {
  it('returns SQL without parameters as is', () => {
    const adapter = new MockAdapter()
    const sql = 'SELECT * FROM table'
    const result = compile(adapter, sql)

    expect(result).toBe(sql)
  })

  it('fails when a parameter is not provided', () => {
    const adapter = new MockAdapter()
    const sql = 'SELECT * FROM table WHERE column = {param("column")}'
    const params: QueryParams = {}
    const action = () => compile(adapter, sql, params)

    expect(action).toThrow(SyntaxError)
  })

  it('compiles SQL with simple parameters correctly', () => {
    const adapter = new MockAdapter()
    const sql = 'SELECT * FROM table WHERE column = {param("column", "default")}'
    const params = { column: 'value' }
    const result = compile(adapter, sql, params)

    expect(result).toBe('SELECT * FROM table WHERE column = $[[value]]')
  })

  it('allows for simple arithmetic operations', () => {
    const adapter = new MockAdapter()
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
      const result = compile(adapter, sql, params)

      expect(result).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it('respects operation order', () => {
    const adapter = new MockAdapter()
    const operations = [
      ['1 + 2 * 3', 7],
      ['(1 + 2) * 3', 9],
      ['1 + 2 - 3', 0],
      ['(1 + 2) - 3', 0],
      ['1 + (2 - 3)', 0],
      ['1 / 2 + 3', 3.5],
      ['1 / (2 + 3)', 0.2]
    ]

    operations.forEach(([expression, expected]) => {
      const sql = `{${expression}}`
      const params = { column: 1 }
      const result = compile(adapter, sql, params)

      expect(result).toBe(`$[[${expected}]]`)
    })
  })

  it ('allows for simple logical operations', () => {
    const adapter = new MockAdapter()
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
      const result = compile(adapter, sql, params)

      expect(result).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it ('allows for simple comparison operations', () => {
    const adapter = new MockAdapter()
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
      const result = compile(adapter, sql, params)

      expect(result).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it ('allows for simple nullish coalescing operations', () => {
    const adapter = new MockAdapter()
    const operations = [
      [5, '??', 1, 5],
      [null, '??', 1, 1],
      [undefined, '??', 1, 1],
    ]

    operations.forEach(([left, operator, right, expected]) => {
      const sql = `SELECT * FROM table WHERE column = {param("column") ${operator} ${right}}`
      const params = { column: left }
      const result = compile(adapter, sql, params)

      expect(result).toBe(`SELECT * FROM table WHERE column = $[[${expected}]]`)
    })
  })

  it('allows conditional expressions', () => {
    const adapter = new MockAdapter()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {/if}`
    const result1 = compile(adapter, sql, { limit: 5 })
    const result2 = compile(adapter, sql, { limit: 0 })
    const result3 = compile(adapter, sql, { limit: undefined })

    expect(result1).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2).toBe('SELECT * FROM table')
    expect(result3).toBe('SELECT * FROM table')
  })

  it('allows else statements', () => {
    const adapter = new MockAdapter()
    const sql = `SELECT * FROM table {#if param("limit", 0)} LIMIT {param("limit")} {:else} OFFSET {param("offset")} {/if}`
    const result1 = compile(adapter, sql, { limit: 5 })
    const result2 = compile(adapter, sql, { offset: 10 })

    expect(result1).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result2).toBe('SELECT * FROM table OFFSET $[[10]]')
  })

  it('allows nested conditional expressions', () => {
    const adapter = new MockAdapter()
    const sql = `SELECT * FROM table {#if param("limit")} LIMIT {param("limit")} {#if param("offset")} OFFSET {param("offset")} {/if} {/if}`
    const result1 = compile(adapter, sql, { limit: 5, offset: 10 })
    const result2 = compile(adapter, sql, { limit: 5, offset: 0 })
    const result3 = compile(adapter, sql, { limit: 0, offset: 10 })

    expect(result1).toBe('SELECT * FROM table LIMIT $[[5]] OFFSET $[[10]]')
    expect(result2).toBe('SELECT * FROM table LIMIT $[[5]]')
    expect(result3).toBe('SELECT * FROM table')
  })

  it('allows each loops', () => {
    const adapter = new MockAdapter()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {/each}`
    const params = { columns: ['column_1', 'column_2', 'column_3'] }
    const result = compile(adapter, sql, params)

    expect(result).toBe('SELECT ' + params['columns'].map((column_name, index) => `$[[${index}]] AS $[[${column_name}]], `).join('').trim())
  })

  it('allows each else statements', () => {
    const adapter = new MockAdapter()
    const sql = `SELECT {#each param("columns") as column_name, index} {index} AS {column_name}, {:else} * {/each}`
    const result1 = compile(adapter, sql, { columns: ['column_1', 'column_2', 'column_3'] })
    const result2 = compile(adapter, sql, { columns: [] })

    expect(result1).toBe('SELECT $[[0]] AS $[[column_1]], $[[1]] AS $[[column_2]], $[[2]] AS $[[column_3]],')
    expect(result2).toBe('SELECT *')
  })

  it('allows defining constants', () => {
    const adapter = new MockAdapter()
    const sql1 = `SELECT * FROM table LIMIT {limit}`
    const sql2 = `{@const limit = 5} SELECT * FROM table LIMIT {limit}`

    const action1 = () => compile(adapter, sql1)
    expect(action1).toThrow(SyntaxError)

    const result2 = compile(adapter, sql2)
    expect(result2).toBe(`SELECT * FROM table LIMIT $[[5]]`)
  })
})