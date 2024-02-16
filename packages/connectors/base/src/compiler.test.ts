import {
  type ResolvedParam,
  type CompiledQuery,
  type QueryParams,
} from './types'
import QueryResult from '@latitude-sdk/query_result'
import { DataType } from '@latitude-sdk/query_result'
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

const expectedQueryResult = new QueryResult({
  rowCount: 0,
  fields: [],
  rows: [],
})

const expectQueryResult = (queryResult: QueryResult): void => {
  expectedQueryResult.rowCount = queryResult.rowCount
  expectedQueryResult.fields = queryResult.fields
  expectedQueryResult.rows = queryResult.rows
}

const compilerFns = {
  resolveFn: (
    name: string | undefined,
    value: unknown,
    _: ResolvedParam[],
  ): ResolvedParam => {
    return { name, value, resolvedAs: `$[[${value}]]` }
  },
  readQueryFn: (queryPath: string): string | undefined => {
    return fakeQueries[queryPath]
  },
  runQueryFn: async (_: CompiledQuery): Promise<QueryResult> => {
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
  },
}

const compileQuery = (queryPath: string, params: QueryParams = {}) => {
  return compile({
    queryRequest: { queryPath, params },
    ...compilerFns,
  })
}

describe('parameterisation of interpolated values', async () => {
  afterEach(clearFakeQueries)

  it('resolves simple values', async () => {
    const sql = '{5} {"foo"}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[5]] $[[foo]]')
  })

  it('resolves results of expressions', async () => {
    const sql = '{5 + 5} {"foo" + "var"}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { column: 5 })

    expect(result.sql).toBe('$[[10]] $[[foovar]]')
  })

  it('resolves results of function calls', async () => {
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: 'var' })

    expect(result.sql).toBe('$[[var]]')
  })
})

describe('variable assignment', async () => {
  it('can define variables', async () => {
    const sql = '{foo = 5} {foo}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[5]]')
  })

  it('can define constants', async () => {
    const sql = '{@const foo = 5} {foo}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[5]]')
  })

  it('can update variables', async () => {
    const sql = '{foo = 5} {foo += 2} {foo}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[7]]')
  })

  it('cannot update constants', async () => {
    const sql = '{@const foo = 5} {foo += 2}'
    const queryPath = addFakeQuery(sql)
    const action = () => compileQuery(queryPath)

    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('cannot update variables that are not defined', async () => {
    const sql = '{foo += 2}'
    const queryPath = addFakeQuery(sql)
    const action = () => compileQuery(queryPath)

    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('variables defined in an inner scope are not available in the outer scope', async () => {
    const sql = '{#if true} {foo = 5} {/if} {foo}'
    const queryPath = addFakeQuery(sql)
    const action = () => compileQuery(queryPath)

    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('variables can be modified from an inner scope', async () => {
    const sql = '{foo = 5} {#if true} {foo += 2} {/if} {foo}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[7]]')
  })
})

describe('conditional expressions', async () => {
  afterEach(clearFakeQueries)

  it('prints if content only when true', async () => {
    const sql = '{#if param("foo")} var {/if}'
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { foo: true })
    const result2 = await compileQuery(queryPath, { foo: false })

    expect(result1.sql).toBe('var')
    expect(result2.sql).toBe('')
  })

  it('prints else content when false', async () => {
    const sql = '{#if param("foo")} lorem {:else} impsum {/if}'
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { foo: true })
    const result2 = await compileQuery(queryPath, { foo: false })

    expect(result1.sql).toBe('lorem')
    expect(result2.sql).toBe('impsum')
  })

  it('can define multiple branches', async () => {
    const sql =
      '{#if param("branch") == 1} 1 {:else if param("branch") == 2} 2 {:else} 3 {/if}'
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { branch: 1 })
    const result2 = await compileQuery(queryPath, { branch: 2 })
    const result3 = await compileQuery(queryPath, { branch: 3 })

    expect(result1.sql).toBe('1')
    expect(result2.sql).toBe('2')
    expect(result3.sql).toBe('3')
  })

  it('does not update any variables in an unused branch', async () => {
    const sql =
      '{foo = 5} {#if param("var")} {foo += 2} {:else} {foo += 3} {/if} {foo}'
    const queryPath = addFakeQuery(sql)
    const result1 = await compileQuery(queryPath, { var: true })
    const result2 = await compileQuery(queryPath, { var: false })

    expect(result1.sql).toBe('$[[7]]')
    expect(result2.sql).toBe('$[[8]]')
  })

  it('respects variable scope', async () => {
    const sql1 = '{#if true} {foo = 5} {/if} {foo}'
    const sql2 = '{foo = 5} {#if true} {foo += 1} {/if} {foo}'
    const sql3 = '{foo = 5} {#if true} {foo = 7} {/if} {foo}'
    const queryPath1 = addFakeQuery(sql1)
    const queryPath2 = addFakeQuery(sql2)
    const queryPath3 = addFakeQuery(sql3)
    const action1 = () => compileQuery(queryPath1)
    const result2 = await compileQuery(queryPath2)
    const result3 = await compileQuery(queryPath3)

    await expect(action1()).rejects.toThrow(SyntaxError)
    expect(result2.sql).toBe('$[[6]]')
    expect(result3.sql).toBe('$[[7]]')
  })
})

describe('each loops', async () => {
  afterEach(clearFakeQueries)

  it('prints each content for each element in the array', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element} {element} {/each}"
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[a]]$[[b]]$[[c]]')
  })

  it('gives access to the index of the element', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element, index} {index} {/each}"
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[0]]$[[1]]$[[2]]')
  })

  it('replaces a variable with the value of the element', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element} {element} {/each}"
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[a]]$[[b]]$[[c]]')
  })

  it('prints else content when the array is empty', async () => {
    const sql = '{#each [] as element} {element} {:else} var {/each}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('var')
  })

  it('prints else content when the element is not an array', async () => {
    const sql = '{#each 5 as element} {element} {:else} var {/each}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('var')
  })

  it('does not update any variables in an unused branch', async () => {
    const sql =
      "{foo = 5} {#each ['a', 'b', 'c'] as element} {:else} {foo += 2} {/each} {foo}"
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { columns: ['a', 'b', 'c'] })

    expect(result.sql).toBe('$[[5]]')
  })

  it('respects variable scope', async () => {
    const sql1 = "{#each ['a', 'b', 'c'] as element} {foo = 5} {/each} {foo}"
    const sql2 =
      "{foo = 5} {#each ['a', 'b', 'c'] as element} {foo = 7} {/each} {foo}"
    const sql3 =
      '{foo = 5} {#each [1, 2, 3] as element} {foo += element} {/each} {foo}'
    const queryPath1 = addFakeQuery(sql1)
    const queryPath2 = addFakeQuery(sql2)
    const queryPath3 = addFakeQuery(sql3)
    const action1 = () => compileQuery(queryPath1)
    const result2 = await compileQuery(queryPath2)
    const result3 = await compileQuery(queryPath3)

    await expect(action1()).rejects.toThrow(SyntaxError)
    expect(result2.sql).toBe('$[[7]]')
    expect(result3.sql).toBe('$[[11]]')
  })
})

describe('operators', async () => {
  afterEach(clearFakeQueries)

  it('correctly evaluates binary expressions', async () => {
    const expressions: [string, any][] = [
      ['2 == 2', true],
      ['2 == 3', false],
      ["2 == 'cat'", false],
      ["2 == '2'", true],
      ['2 != 2', false],
      ['2 != 3', true],
      ['2 === 2', true],
      ["2 === '2'", false],
      ['2 !== 2', false],
      ["2 !== '2'", true],
      // ["2 < 2", false],
      // ["2 < 3", true],
      // ["2 < 1", false],
      // ["2 <= 2", true],
      // ["2 <= 3", true],
      // ["2 <= 1", false],
      ['2 > 2', false],
      ['2 > 3', false],
      ['2 > 1', true],
      ['2 >= 2', true],
      ['2 >= 3', false],
      ['2 >= 1', true],
      // ["2 << 2", 8],
      ['2 >> 2', 0],
      ['2 >>> 2', 0],
      ['2 + 3', 5],
      ['2 - 3', -1],
      ['2 * 3', 6],
      ['2 / 3', 2 / 3],
      ['2 % 3', 2],
      ['2 | 3', 3],
      ['2 ^ 3', 1],
      ['2 & 3', 2],
      ["'cat' in {cat: 1, dog: 2}", true],
      ["'cat' in {dog: 1, hamster: 2}", false],
    ]
    for (const [expression, expected] of expressions) {
      const cleanExpression = expression.replace(/{/g, '(').replace(/}/g, ')')
      const sql = `${cleanExpression} = {${expression}}`
      const queryPath = addFakeQuery(sql)
      const result = await compileQuery(queryPath)

      expect(result.sql).toBe(`${cleanExpression} = $[[${expected}]]`)
    }
  })

  it('correctly evaluates logical expressions', async () => {
    const expressions = [
      ['true && true', true],
      ['true && false', false],
      ['false && true', false],
      ['false && false', false],
      ['true || true', true],
      ['true || false', true],
      ['false || true', true],
      ['false || false', false],
      ['false ?? true', false],
      ['null ?? true', true],
    ]
    for (const [expression, expected] of expressions) {
      const sql = `${expression} = {${expression}}`
      const queryPath = addFakeQuery(sql)
      const result = await compileQuery(queryPath)

      expect(result.sql).toBe(`${expression} = $[[${expected}]]`)
    }
  })

  it('correctly evaluates unary expressions', async () => {
    const expressions = [
      ['-2', -2],
      ['+2', 2],
      ['!true', false],
      ['~2', ~2],
      ['typeof 2', 'number'],
      ['void 2', undefined],
    ]
    for (const [expression, expected] of expressions) {
      const sql = `${expression} = {${expression}}`
      const queryPath = addFakeQuery(sql)
      const result = await compileQuery(queryPath)

      expect(result.sql).toBe(`${expression} = $[[${expected}]]`)
    }
  })

  it('correctly evaluates member expressions', async () => {
    const sql = "{param('foo').bar}"
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: { bar: 'var' } })

    expect(result.sql).toBe('$[[var]]')
  })

  it('correctly evaluates assignment expressions', async () => {
    const expressions: [string, any, any][] = [
      ['foo += 2', 3, 5],
      ['foo -= 2', 3, 1],
      ['foo *= 2', 3, 6],
      ['foo /= 2', 3, 1.5],
      ['foo %= 2', 3, 1],
      // ["foo <<= 2", 3, 12],
      ['foo >>= 2', 3, 0],
      ['foo >>>= 2', 3, 0],
      ['foo |= 2', 3, 3],
      ['foo ^= 2', 3, 1],
      ['foo &= 2', 3, 2],
    ]
    for (const [expression, initial, expected] of expressions) {
      const cleanExpression = expression.replace(/{/g, '(').replace(/}/g, ')')
      const sql = `{foo = ${initial}} {${expression}} ${cleanExpression} -> {foo}`
      const queryPath = addFakeQuery(sql)
      const result = await compileQuery(queryPath)

      expect(result.sql).toBe(`${cleanExpression} -> $[[${expected}]]`)
    }
  })

  it('can evaluate complex expressions respecting operator precedence', async () => {
    const expressions: [string, any][] = [
      ['2 + 3 * 4', 14],
      ['2 * 3 + 4', 10],
      ['2 * (3 + 4)', 14],
      ['2 + 3 * 4 / 2', 8],
      ['2 + 3 * 4 % 2', 2],
      ['2 + 3 * 4 | 2', 14],
      ['2 + 3 * 4 ^ 2', 12],
      ['2 + 3 * 4 & 2', 2],
      ['2 + 3 * 4 === 14', true],
      ['2 + 3 * 4 !== 14', false],
      ['2 + 3 * 4 == 14', true],
      ['2 + 3 * 4 != 14', false],
      ["'a' + 'b' in {ab: 1, bc: 2}", true],
      ["'a' + 'b' in {bc: 1, cd: 2}", false],
      ["'a' + 'b' in {ab: 1, bc: 2} && 'a' + 'b' in {bc: 1, cd: 2}", false],
      ["'a' + 'b' in {ab: 1, bc: 2} || 'a' + 'b' in {bc: 1, cd: 2}", true],
    ]
    for (const [expression, expected] of expressions) {
      const cleanExpression = expression.replace(/{/g, '(').replace(/}/g, ')')
      const sql = `${cleanExpression} = {${expression}}`
      const queryPath = addFakeQuery(sql)
      const result = await compileQuery(queryPath)

      expect(result.sql).toBe(`${cleanExpression} = $[[${expected}]]`)
    }
  })
})

describe('params function', async () => {
  afterEach(clearFakeQueries)

  it('returns the value of a parameter', async () => {
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: 'var' })

    expect(result.sql).toBe('$[[var]]')
  })

  it('returns the default value when the parameter is not provided', async () => {
    const sql = '{param("foo", "default")}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath)

    expect(result.sql).toBe('$[[default]]')
  })

  it('returns the given value even if it is null', async () => {
    const sql = '{param("foo", "default")}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: null })

    expect(result.sql).toBe('$[[null]]')
  })

  it('throws an error when the parameter is not provided and there is no default value', async () => {
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    const action = () => compileQuery(queryPath)

    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('parametrises the value when called as interpolation', async () => {
    const sql = '{param("foo")}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: 'var' })

    expect(result.sql).toBe('$[[var]]')
  })

  it('returns the actual value when called inside a logical expression', async () => {
    const sql = '{param("foo") + 3}'
    const queryPath = addFakeQuery(sql)
    const result = await compileQuery(queryPath, { foo: 2 })

    expect(result.sql).toBe('$[[5]]')
  })
})

describe('ref function', async () => {
  afterEach(clearFakeQueries)

  it('interpolates a subquery into the main query and wraps it in parentheses', async () => {
    const mainQuery = 'main {ref("referenced_query")} end'
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    const result = await compileQuery(mainQueryPath)
    expect(result.sql).toBe('main (ref) end')
  })

  it('fails if query does not exist', async () => {
    const mainQuery = 'main {ref("referenced_query")} end'
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('fails if called inside a logical expression', async () => {
    const mainQuery = "{result = {ref('referenced_query')}} {result}"
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })
})

describe('run_query function', async () => {
  afterEach(clearFakeQueries)

  it('runs a subquery and returns it as a value', async () => {
    expectQueryResult(new QueryResult({ rowCount: 1, fields: [], rows: [] }))
    const mainQuery =
      "{result = run_query('referenced_query')} {result.rowCount}"
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    const result = await compileQuery(mainQueryPath)
    expect(result.sql).toBe('$[[1]]')
  })

  it('fails if query does not exist', async () => {
    const mainQuery =
      "{result = {run_query('referenced_query')}} {result.rowCount}"
    const mainQueryPath = addFakeQuery(mainQuery)

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })

  it('fails if called as interpolation', async () => {
    expectQueryResult(new QueryResult({ rowCount: 1, fields: [], rows: [] }))
    const mainQuery = "{run_query('referenced_query')}"
    const refQuery = 'ref'
    const mainQueryPath = addFakeQuery(mainQuery)
    addFakeQuery(refQuery, 'referenced_query')

    const action = () => compileQuery(mainQueryPath)
    await expect(action()).rejects.toThrow(SyntaxError)
  })
})
