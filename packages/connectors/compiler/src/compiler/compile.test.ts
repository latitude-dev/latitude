import { compile, emptyMetadata } from '..'
import CompileError from '../error/error'
import { describe, it, expect } from 'vitest'

const resolveFn = async (value: unknown): Promise<string> => `$[[${value}]]`

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

describe('compilation of comments', async () => {
  it('keeps line comments in the output', async () => {
    const sql = 'foo\n-- comment\nbar'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe(sql)
  })

  it('keeps block comments in the output', async () => {
    const sql = 'foo\n/* comment1\ncomment2\ncomment3 */\nbar'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe(sql)
  })
})

describe('parameterisation of interpolated values', async () => {
  it('resolves simple values', async () => {
    const sql = '{5} {"foo"}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[5]] $[[foo]]')
  })

  it('resolves results of expressions', async () => {
    const sql = '{5 + 5} {"foo" + "var"}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[10]] $[[foovar]]')
  })

  it('resolves every value in order of appearance', async () => {
    let index = 0
    const resolveFn = async (_: unknown): Promise<string> => `[${index++}]`
    const sql = `
      {@const fooConst = 5}
      {5} {"foo"} {5 + 5} {"foo" + "var"}
      {#if false} {5} {"foo"} {5 + 5} {"foo" + "var"}
      {:else} {5} {"foo"} {5 + 5} {"foo" + "var"}
      {/if}
      {#each [1, 2, 3] as element} {element} {fooConst} {/each}
    `
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    const matches = result.match(/\[\d+\]/g) || [] // resolved values in order of appearance in the string
    const expected = Array.from({ length: matches.length }, (_, i) => `[${i}]`) // expected values
    expect(matches).toEqual(expected)
  })
})

describe('variable assignment', async () => {
  it('can define variables', async () => {
    const sql = '{foo = 5} {foo}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[5]]')
  })

  it('can define constants', async () => {
    const sql = '{@const foo = 5} {foo}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[5]]')
  })

  it('can update variables', async () => {
    const sql = '{foo = 5} {foo += 2} {foo}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[7]]')
  })

  it('cannot update constants', async () => {
    const sql = '{@const foo = 5} {foo += 2}'
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('constant-reassignment')
  })

  it('cannot update variables that are not defined', async () => {
    const sql = '{foo += 2}'
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('variable-not-declared')
  })

  it('variables defined in an inner scope are not available in the outer scope', async () => {
    const sql = '{#if true} {foo = 5} {/if} {foo}'
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('variable-not-declared')
  })

  it('variables can be modified from an inner scope', async () => {
    const sql = '{foo = 5} {#if true} {foo += 2} {/if} {foo}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[7]]')
  })

  it('can update nested values', async () => {
    const sql = `
      {foo = { a: 1, b: 2 }}
      {foo.a += 2}
      {foo.b += 3}
      {foo.a} {foo.b}
    `
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[3]] $[[5]]')
  })

  it('fails when nested value does not exist', async () => {
    const sql = `
      {foo = { a: 1, b: 2 }}
      {foo.c += 2}
      {foo.c}
    `
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('property-not-exists')
  })

  it('does not allow optional chaining operator', async () => {
    const sql = `
      {foo = { a: 1, b: 2 }}
      {foo?.a = 2}
    `
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('parse-error') // Requirement is already implemented in the parser
  })

  it('allow reassigning elements in an array', async () => {
    const sql = `
      {foo = [1, 2, 3, 4, 5, 6]}
      {foo[3] = 'bar'}

      {foo}
    `

    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })
    expect(result).toBe('$[[1,2,3,bar,5,6]]')
  })

  it('can modify variables with update operators', async () => {
    const sql1 = '{foo = 0} {foo++} {foo}'
    const sql2 = '{foo = 0} {++foo} {foo}'

    const result1 = await compile({
      query: sql1,
      resolveFn,
      supportedMethods: {},
    })
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })

    expect(result1).toBe('$[[0]] $[[1]]')
    expect(result2).toBe('$[[1]] $[[1]]')
  })

  it('fails when trying to update a variable that is not a number', async () => {
    const sql = '{foo = "bar"} {++foo}'
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('invalid-update')
  })
})

describe('conditional expressions', async () => {
  it('prints if content only when true', async () => {
    const sql1 = '{#if true} var {/if}'
    const sql2 = '{#if false} var {/if}'
    const result1 = await compile({
      query: sql1,
      resolveFn,
      supportedMethods: {},
    })
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })

    expect(result1).toBe('var')
    expect(result2).toBe('')
  })

  it('prints else content when false', async () => {
    const sql1 = '{#if true} lorem {:else} impsum {/if}'
    const sql2 = '{#if false} lorem {:else} impsum {/if}'
    const result1 = await compile({
      query: sql1,
      resolveFn,
      supportedMethods: {},
    })
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })

    expect(result1).toBe('lorem')
    expect(result2).toBe('impsum')
  })

  it('can define multiple branches', async () => {
    const sql1 = '{#if true} 1 {:else if false} 2 {:else} 3 {/if}'
    const sql2 = '{#if false} 1 {:else if true} 2 {:else} 3 {/if}'
    const sql3 = '{#if false} 1 {:else if false} 2 {:else} 3 {/if}'
    const result1 = await compile({
      query: sql1,
      resolveFn,
      supportedMethods: {},
    })
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })
    const result3 = await compile({
      query: sql3,
      resolveFn,
      supportedMethods: {},
    })

    expect(result1).toBe('1')
    expect(result2).toBe('2')
    expect(result3).toBe('3')
  })

  it('does not update any variables in an unused branch', async () => {
    const sql1 =
      '{foo = 5} {#if true} {foo += 2} {:else} {foo += 3} {/if} {foo}'
    const sql2 =
      '{foo = 5} {#if false} {foo += 2} {:else} {foo += 3} {/if} {foo}'
    const result1 = await compile({
      query: sql1,
      resolveFn,
      supportedMethods: {},
    })
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })

    expect(result1).toBe('$[[7]]')
    expect(result2).toBe('$[[8]]')
  })

  it('respects variable scope', async () => {
    const sql1 = '{#if true} {foo = 5} {/if} {foo}'
    const sql2 = '{foo = 5} {#if true} {foo += 1} {/if} {foo}'
    const sql3 = '{foo = 5} {#if true} {foo = 7} {/if} {foo}'
    const action1 = () =>
      compile({
        query: sql1,
        resolveFn,
        supportedMethods: {},
      })
    const error1 = await getExpectedError(action1, CompileError)
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })
    const result3 = await compile({
      query: sql3,
      resolveFn,
      supportedMethods: {},
    })

    expect(error1.code).toBe('variable-not-declared')
    expect(result2).toBe('$[[6]]')
    expect(result3).toBe('$[[7]]')
  })
})

describe('each loops', async () => {
  it('prints each content for each element in the array', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element} {element} {/each}"
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[a]]$[[b]]$[[c]]')
  })

  it('gives access to the index of the element', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element, index} {index} {/each}"
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[0]]$[[1]]$[[2]]')
  })

  it('replaces a variable with the value of the element', async () => {
    const sql = "{#each ['a', 'b', 'c'] as element} {element} {/each}"
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[a]]$[[b]]$[[c]]')
  })

  it('prints else content when the array is empty', async () => {
    const sql = '{#each [] as element} {element} {:else} var {/each}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('var')
  })

  it('prints else content when the element is not an array', async () => {
    const sql = '{#each 5 as element} {element} {:else} var {/each}'
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('var')
  })

  it('does not update any variables in an unused branch', async () => {
    const sql =
      "{foo = 5} {#each ['a', 'b', 'c'] as element} {:else} {foo += 2} {/each} {foo}"
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[5]]')
  })

  it('respects variable scope', async () => {
    const sql1 = "{#each ['a', 'b', 'c'] as element} {foo = 5} {/each} {foo}"
    const sql2 =
      "{foo = 5} {#each ['a', 'b', 'c'] as element} {foo = 7} {/each} {foo}"
    const sql3 =
      '{foo = 5} {#each [1, 2, 3] as element} {foo += element} {/each} {foo}'
    const action1 = () =>
      compile({
        query: sql1,
        resolveFn,
        supportedMethods: {},
      })
    const error1 = await getExpectedError(action1, CompileError)
    const result2 = await compile({
      query: sql2,
      resolveFn,
      supportedMethods: {},
    })
    const result3 = await compile({
      query: sql3,
      resolveFn,
      supportedMethods: {},
    })

    expect(error1.code).toBe('variable-not-declared')
    expect(result2).toBe('$[[7]]')
    expect(result3).toBe('$[[11]]')
  })
})

describe('operators', async () => {
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
      ['2 < 2', false],
      ['2 < 3', true],
      ['2 < 1', false],
      ['2 <= 2', true],
      ['2 <= 3', true],
      ['2 <= 1', false],
      ['2 > 2', false],
      ['2 > 3', false],
      ['2 > 1', true],
      ['2 >= 2', true],
      ['2 >= 3', false],
      ['2 >= 1', true],
      ['2 << 2', 8],
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
      const result = await compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })

      expect(result).toBe(`${cleanExpression} = $[[${expected}]]`)
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
      const result = await compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })

      expect(result).toBe(`${expression} = $[[${expected}]]`)
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
      const result = await compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })

      expect(result).toBe(`${expression} = $[[${expected}]]`)
    }
  })

  it('correctly evaluates member expressions', async () => {
    const sql = "{foo = { bar: 'var' }}{foo.bar}"
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })

    expect(result).toBe('$[[var]]')
  })

  it('correctly evaluates assignment expressions', async () => {
    const expressions: [string, any, any][] = [
      ['foo += 2', 3, 5],
      ['foo -= 2', 3, 1],
      ['foo *= 2', 3, 6],
      ['foo /= 2', 3, 1.5],
      ['foo %= 2', 3, 1],
      ['foo <<= 2', 3, 12],
      ['foo >>= 2', 3, 0],
      ['foo >>>= 2', 3, 0],
      ['foo |= 2', 3, 3],
      ['foo ^= 2', 3, 1],
      ['foo &= 2', 3, 2],
    ]
    for (const [expression, initial, expected] of expressions) {
      const cleanExpression = expression.replace(/{/g, '(').replace(/}/g, ')')
      const sql = `{foo = ${initial}} {${expression}} ${cleanExpression} -> {foo}`
      const result = await compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })

      expect(result).toBe(`${cleanExpression} -> $[[${expected}]]`)
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
      const result = await compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })

      expect(result).toBe(`${cleanExpression} = $[[${expected}]]`)
    }
  })
})

describe('custom methods', async () => {
  it('fails when calling an undefined method', async () => {
    const sql = '{fooFn()}'
    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('variable-not-declared')
  })

  it('shows the correct error message when a named method fails', async () => {
    const sql = '{fooFn()}'
    const action = () =>
      compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            resolve: async () => {
              throw new Error('bar')
            },
            readMetadata: async () => emptyMetadata(),
          },
        },
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
    expect(error.message).toBe('Error calling function: \nError bar')
  })

  describe('interpolation policy', async () => {
    it('fails when trying to interpolate a disallowed method', async () => {
      const sql = '{fooFn()}'
      const action = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              requirements: { interpolationPolicy: 'disallow' },
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      const error = await getExpectedError(action, CompileError)
      expect(error.code).toBe('function-disallows-interpolation')
    })

    it('fails when not interpolating a required method', async () => {
      const sql = '{foo = fooFn()}'
      const action = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              requirements: { interpolationPolicy: 'require' },
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      const error = await getExpectedError(action, CompileError)
      expect(error.code).toBe('function-requires-interpolation')
    })

    it('does not fail when interpolating an allowed method', async () => {
      const sql = '{fooFn()}'
      const result1 = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            requirements: { interpolationPolicy: 'allow' },
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })
      const result2 = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            requirements: { interpolationPolicy: 'require' },
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result1).toBe('$[[bar]]')
      expect(result2).toBe('$[[bar]]')
    })

    it('does not fail when not interpolating a disallowed method', async () => {
      const sql = '{foo = fooFn()}'
      const action1 = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              requirements: { interpolationPolicy: 'disallow' },
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      const action2 = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              requirements: { interpolationPolicy: 'allow' },
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      expect(action1).not.toThrow()
      expect(action2).not.toThrow()
    })

    it('allows interpolation by default', async () => {
      const sql = '{fooFn()}'
      const result = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result).toBe('$[[bar]]')
    })
  })

  describe('interpolation method', async () => {
    it('parameterizes the returned value when it is set to "parameterize"', async () => {
      const sql = '{fooFn()}'
      const result = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            requirements: { interpolationMethod: 'parameterize' },
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result).toBe('$[[bar]]')
    })

    it('does not parameterize the returned value when it is set to "raw"', async () => {
      const sql = '{fooFn()}'
      const result = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            requirements: { interpolationMethod: 'raw' },
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result).toBe('bar')
    })

    it('uses parameterization by default', async () => {
      const sql = '{fooFn()}'
      const result = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            resolve: async () => 'bar',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result).toBe('$[[bar]]')
    })
  })

  describe('require static arguments', async () => {
    it('allows any kind of arguments when static arguments are not required', async () => {
      const sql = `
        {variables = 'variables'}
        {fooFn('literal values', variables, functions(), 2 + 2)}
      `
      const result = await compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          fooFn: {
            resolve: async (...args: unknown[]) => args.join(', '),
            readMetadata: async () => emptyMetadata(),
          },
          functions: {
            resolve: async () => 'functions',
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

      expect(result).toBe('$[[literal values, variables, functions, 4]]')
    })

    it('fails when not using literal values as arguments when required', async () => {
      const sql = `
        {bar = 'bar'}
        {fooFn(bar)}
      `
      const action = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              requirements: { requireStaticArguments: true },
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      const error = await getExpectedError(action, CompileError)
      expect(error.code).toBe('function-requires-static-arguments')
    })

    it('does not require static arguments by default', async () => {
      const sql = `
        {bar = 'bar'}
        {fooFn(bar)}
      `
      const action = () =>
        compile({
          query: sql,
          resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
          supportedMethods: {
            fooFn: {
              resolve: async () => 'bar',
              readMetadata: async () => emptyMetadata(),
            },
          },
        })
      expect(action).not.toThrow()
    })
  })

  it('runs any method defined in the supportedMethods object', async () => {
    const sql = '{fooFn()}'
    const result = await compile({
      query: sql,
      resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
      supportedMethods: {
        fooFn: {
          resolve: async () => 'bar',
          readMetadata: async () => emptyMetadata(),
        },
      },
    })

    expect(result).toBe('$[[bar]]')
  })
})

describe('variable member access', async () => {
  it('correctly evaluates member access', async () => {
    const sql = `
      {foo = { bar: 'val' } }
      {foo.bar}
    `
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })
    expect(result).toBe('$[[val]]')
  })

  it('allows optional chaining operator', async () => {
    const sql1 = `
      {foo = { bar: 'val' } }
      {foo?.bar}
    `
    const sql2 = `
      {foo = undefined() }
      {foo?.bar}
    `

    function compileQuery(sql: string) {
      return compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          undefined: {
            resolve: async () => undefined,
            readMetadata: async () => emptyMetadata(),
          },
        },
      })
    }

    const result1 = await compileQuery(sql1)
    const result2 = await compileQuery(sql2)

    expect(result1).toBe('$[[val]]')
    expect(result2).toBe('$[[undefined]]')
  })

  it('runs methods from variables', async () => {
    const nowDate = new Date()

    const sql = `
      {currentTime = now()}
      {currentTime.toISOString()}
    `

    const result = await compile({
      query: sql,
      resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
      supportedMethods: {
        now: {
          resolve: async () => nowDate,
          readMetadata: async () => emptyMetadata(),
        },
      },
    })

    const expectedString = nowDate.toISOString()
    expect(result).toBe(`$[[${expectedString}]]`)
  })

  it('fails when trying to run non-function methods', async () => {
    const sql = `
      {foo = 'bar'}
      {foo.bar()}
    `

    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('not-a-function')
  })
})

describe('variable member access', async () => {
  it('correctly evaluates member access', async () => {
    const sql = `
      {foo = { bar: 'val' } }
      {foo.bar}
    `
    const result = await compile({
      query: sql,
      resolveFn,
      supportedMethods: {},
    })
    expect(result).toBe('$[[val]]')
  })

  it('allows optional chaining operator', async () => {
    const sql1 = `
      {foo = { bar: 'val' } }
      {foo?.bar}
    `
    const sql2 = `
      {foo = undefined() }
      {foo?.bar}
    `

    function compileQuery(sql: string) {
      return compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          undefined: {
            resolve: async () => undefined,
            readMetadata: async () => emptyMetadata(),
          },
        },
      })
    }

    const result1 = await compileQuery(sql1)
    const result2 = await compileQuery(sql2)

    expect(result1).toBe('$[[val]]')
    expect(result2).toBe('$[[undefined]]')
  })

  it('runs methods from variables', async () => {
    const nowDate = new Date()

    const sql = `
      {currentTime = now()}
      {currentTime.toISOString()}
    `

    const result = await compile({
      query: sql,
      resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
      supportedMethods: {
        now: {
          resolve: async () => nowDate,
          readMetadata: async () => emptyMetadata(),
        },
      },
    })

    const expectedString = nowDate.toISOString()
    expect(result).toBe(`$[[${expectedString}]]`)
  })

  it('fails when trying to run non-function methods', async () => {
    const sql = `
      {foo = 'bar'}
      {foo.bar()}
    `

    const action = () =>
      compile({
        query: sql,
        resolveFn,
        supportedMethods: {},
      })
    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('not-a-function')
  })

  it('shows the correct error message when a varaible method fails', async () => {
    const sql = `
      {foo = getFoo()}
      {foo.bar()}
    `

    const action = () =>
      compile({
        query: sql,
        resolveFn: async (value: unknown): Promise<string> => `$[[${value}]]`,
        supportedMethods: {
          getFoo: {
            resolve: async () => {
              throw new Error('baz')
            },
            readMetadata: async () => emptyMetadata(),
          },
        },
      })

    const error = await getExpectedError(action, CompileError)
    expect(error.code).toBe('function-call-error')
    expect(error.message).toBe('Error calling function: \nError baz')
  })
})
