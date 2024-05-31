import fs from 'fs'
import mockFs from 'mock-fs'
import { describe, it, expect, afterEach, beforeEach, assert } from 'vitest'
import { QUERIES_DIR, getSource } from '@/tests/helper'
import { CompileError } from '@latitude-data/sql-compiler'

describe('supportedMethods', async () => {
  beforeEach(() => {
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': `
        type: internal_test
      `,
      },
      '/tmp/.latitude': {},
    })
  })

  afterEach(() => {
    mockFs.restore()
  })

  describe('interpolate function', async () => {
    it('interpolates a value directly into the query', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{interpolate("foo")}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('foo')
    })

    it('interpolates a value directly into the query even if it is null', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{interpolate("null")}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('null')
    })

    it('interpolates the value of a variable into the query', async () => {
      fs.writeFileSync(
        `${QUERIES_DIR}/query.sql`,
        '{bar = "foo"}{interpolate(bar)}',
      )
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('foo')
    })

    it('interpolates the value of an expression into the query', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{interpolate(1 + 2)}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('3')
    })

    it('fails if called inside a logical expression', async () => {
      fs.writeFileSync(
        `${QUERIES_DIR}/query.sql`,
        "{result = {interpolate('foo')}} {result}",
      )
      const source = await getSource('query')

      await expect(
        source.compileQuery({
          queryPath: 'query',
          params: {},
        }),
      ).rejects.toThrowError(new CompileError('Unexpected token'))
    })
  })

  describe('param function', async () => {
    it('returns the value of a parameter', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{param("foo")}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: { foo: 'bar' },
      })

      expect(compiled.sql).toBe('[[bar]]')
    })

    it('returns the default value when the parameter is not provided', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{param("foo", "default")}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('[[default]]')
    })

    it('returns the given value even if it is null', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{param("foo", "default")}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: { foo: null },
      })

      expect(compiled.sql).toBe('[[null]]')
    })

    it('throw error if not default and no param', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{param("foo")}')
      const source = await getSource('query')

      await expect(
        source.compileQuery({
          queryPath: 'query',
          params: {},
        }),
      ).rejects.toThrowError(
        new CompileError(
          "Error calling function: \nError Missing parameter 'foo' in request",
        ),
      )
    })

    it('parametrises the raw value when called as interpolation', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{"patata"}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: {},
      })

      expect(compiled.sql).toBe('[[patata]]')
    })

    it('returns the actual value when called inside a logical expression', async () => {
      fs.writeFileSync(`${QUERIES_DIR}/query.sql`, '{param("foo") + 3}')
      const source = await getSource('query')
      const compiled = await source.compileQuery({
        queryPath: 'query',
        params: { foo: 2 },
      })

      expect(compiled.sql).toBe('[[5]]')
    })
  })

  describe('ref function', async () => {
    it('get SQL from relative', async () => {
      mockFs({
        [QUERIES_DIR]: {
          'source.yml': 'type: internal_test',
          subfolder: {
            'query.sql': 'main {ref("./subfolder2/referenced_query")} end',
            subfolder2: {
              'referenced_query.sql': 'SELECT patata FROM huerto',
            },
          },
        },
        '/tmp/.latitude': {},
      })
      const queryPath = 'subfolder/query'
      const source = await getSource(queryPath)
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })

      expect(compiled.sql).toBe('main (SELECT patata FROM huerto) end')
    })

    it('get sql with relative dot', async () => {
      mockFs({
        [QUERIES_DIR]: {
          'source.yml': 'type: internal_test',
          subfolder: {
            'query.sql': 'main {ref("subfolder2/referenced_query")} end',
            subfolder2: {
              'referenced_query.sql': 'SELECT patata FROM huerto',
            },
          },
        },
        '/tmp/.latitude': {},
      })
      const queryPath = 'subfolder/query'
      const source = await getSource(queryPath)
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })

      expect(compiled.sql).toBe('main (SELECT patata FROM huerto) end')
    })

    it('runs a query from parent folder', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': 'ref',
          subfolder: {
            'inner_query.sql': "SELECT * FROM {ref('../query')}",
          },
        },
      })
      const queryPath = 'subfolder/inner_query'
      const source = await getSource(queryPath, '/my-queries')
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })
      expect(compiled.sql).toBe('SELECT * FROM (ref)')
    })

    it('get sql with absolute path', async () => {
      mockFs({
        [QUERIES_DIR]: {
          'source.yml': 'type: internal_test',
          subfolder: {
            'query.sql':
              'main {ref("/subfolder/subfolder2/referenced_query")} end',
            subfolder2: {
              'referenced_query.sql': 'SELECT patata FROM huerto',
            },
          },
        },
        '/tmp/.latitude': {},
      })
      const queryPath = 'subfolder/query'
      const source = await getSource(queryPath)
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })

      expect(compiled.sql).toBe('main (SELECT patata FROM huerto) end')
    })

    it('fails if query does not exist', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': 'main {ref("referenced_query")} end',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(
        new CompileError(
          'Error calling function: \nQueryNotFoundError Query file not found at /my-queries/referenced_query.sql',
        ),
      )
    })

    it('fails if called inside a logical expression', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{result = {ref('referenced_query')}} {result}",
          'referenced_query.sql': 'SELECT patata FROM huerto',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(new CompileError('Unexpected token'))
    })

    it('fails when there are cyclic references', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{result = {ref('referenced_query')}} {result}",
          'referenced_query.sql': "ref('query')",
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(new CompileError('Unexpected token'))
    })

    it('has access to parent global parameters', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{ref('referenced_query')}",
          'referenced_query.sql': '{param("foo")}',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      const compiled = await source.compileQuery({
        queryPath,
        params: { foo: 'bar' },
      })
      expect(compiled.sql).toBe('([[bar]])')
    })
  })

  describe('runQuery function', async () => {
    it('runs a subquery and returns it as a value', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql':
            "{result = runQuery('referenced_query')} {result.length}",
          'referenced_query.sql': 'ref',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })
      expect(compiled.sql).toBe('[[1]]')
    })

    it('runs a query from parent folder', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': 'ref',
          subfolder: {
            'inner_query.sql':
              "{result = runQuery('../query')} {result.length}",
          },
        },
      })
      const queryPath = 'subfolder/inner_query'
      const source = await getSource(queryPath, '/my-queries')
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })
      expect(compiled.sql).toBe('[[1]]')
    })

    it('fails if query does not exist', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{result = {ref('referenced_query')}} {result}",
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(new CompileError('Unexpected token'))
    })

    it('fails if called as interpolation', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{runQuery('referenced_query')}",
          'referenced_query.sql': 'ref',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(
        new CompileError(
          "Function 'runQuery' cannot be directly interpolated into the query",
        ),
      )
    })

    it('fails when there are cyclic references', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{result = {ref('referenced_query')}} {result}",
          'referenced_query.sql': "{result = {ref('query')}} {result}",
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await expect(
        source.compileQuery({
          queryPath,
          params: {},
        }),
      ).rejects.toThrowError(new CompileError('Unexpected token'))
    })

    it('does not run the same query twice', async () => {
      const childQuery =
        "{@const result = runQuery('referenced_query')}{result.length}"
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{ref('child1')}{ref('child2')}{ref('child3')}",
          'child1.sql': childQuery,
          'child2.sql': childQuery,
          'child3.sql': childQuery,
          'referenced_query.sql': 'ref',
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      const compiled = await source.compileQuery({
        queryPath,
        params: {},
      })
      expect(compiled.sql).toBe('([[1]])([[1]])([[1]])')
    })

    it('has access to parent global parameters', async () => {
      mockFs({
        '/my-queries': {
          'source.yml': 'type: internal_test',
          'query.sql': "{results = runQuery('referenced_query')}",
          'referenced_query.sql': "{param('foo')}",
        },
      })
      const queryPath = 'query'
      const source = await getSource(queryPath, '/my-queries')
      await source
        .compileQuery({
          queryPath,
          params: { foo: 'bar' },
        })
        .then(() => assert(true))
        .catch(() => assert(false))
    })
  })
})
