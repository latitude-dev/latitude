import mockFs from 'mock-fs'
import { describe, it, expect } from 'vitest'
import {
  QUERIES_DIR,
  MATERIALIZE_QUERIES_DIR,
  buildMaterializedConnector,
} from '$/tests/helpers'
import {
  CompileError,
  SourceManager,
  buildDefaultContext,
} from '@latitude-data/source-manager'
import MaterializedConnector from '$/index'

const MATERIALIZED_SQL = `
{@config materialize_query = true}
SELECT * FROM users
`
describe('materializedRef function', async () => {
  it('find queries in a folder out of current source', async () => {
    const sql = "SELECT * FROM {materializedRef('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': MATERIALIZED_SQL,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
      [MATERIALIZE_QUERIES_DIR]: {
        'c669ba7574cadcfd9527e449feeb6a3fe8c23e23d0fef0893d3011c85ac88624.parquet':
          'PARQUET_QUERY_CONTENT', // Not important in this tests
      },
    })
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })
    const context = buildDefaultContext()
    const compiled = await connector.compileQuery({
      ...context,
      request: {
        queryPath: 'materialized-queries/query',
        params: {},
        sql,
      },
    })
    expect(compiled.sql).toBe(
      `SELECT * FROM (read_parquet('${MATERIALIZE_QUERIES_DIR}/c669ba7574cadcfd9527e449feeb6a3fe8c23e23d0fef0893d3011c85ac88624.parquet'))`,
    )
  })

  it('fails when materialized sql is not found', async () => {
    const sql = "SELECT * FROM {materializedRef('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': `
          {@config materialize_query = true}
          SELECT * FROM projects
        `,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })
    const context = buildDefaultContext()
    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: {},
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError(
        "Error calling function: \nMaterializedFileNotFoundError materialize query not found for: materializedRef('../query.sql')",
      ),
    )
  })

  it('fails when ref query is not a string', async () => {
    const sql = 'SELECT * FROM {materializedRef(33)}'
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const context = buildDefaultContext()
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })

    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: {},
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError('Error calling function: \nError Invalid query name'),
    )
  })

  it('fails when the query use parameters', async () => {
    const sql = "SELECT * FROM {materializedRef('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': `
          { @config materialize_query = true }
          SELECT * FROM users WHERE id = { param('id') } AND name = { param('name') }
        `,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const context = buildDefaultContext()
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })

    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: { id: 42, name: 'John' },
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError(
        "Error calling function: \nError '../query.sql' query can not have parameters to filter the SQL query.",
      ),
    )
  })

  it('fails when used materialized config is not defined', async () => {
    const sql = "SELECT * FROM {materializedRef('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': 'SELECT * FROM users',
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const context = buildDefaultContext()
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })

    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: {},
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError(
        "Error calling function: \nError Query 'query.sql' is not a materialized query. \nYou can configure it by setting {@config materialized_query = true} in the query file.",
      ),
    )
  })

  it('fails when used materialized config is set to false', async () => {
    const sql = "SELECT * FROM {materializedRef('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': '{@config materialize_query = false}\nSELECT * FROM users',
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const context = buildDefaultContext()
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })

    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: {},
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError(
        "Error calling function: \nError Query 'query.sql' is not a materialized query. \nYou can have configured {@config materialized_query = false} in the query file. Set it to 'true'",
      ),
    )
  })

  it('fails when used in a logic block', async () => {
    const sql = "{result = materializedRef('../query')} {result}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': MATERIALIZED_SQL,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    })
    const context = buildDefaultContext()
    const { connector } = await buildMaterializedConnector({
      sourceParams: {
        path: 'materialize-queries',
      },
    })

    await expect(
      connector.compileQuery({
        ...context,
        request: {
          queryPath: 'materialized-queries/query',
          params: {},
          sql,
        },
      }),
    ).rejects.toThrowError(
      new CompileError(
        'Error calling function: \nError materializedRef function cannot be used inside a logic block',
      ),
    )
  })

  it('fails when there are cyclic references', async () => {
    const sql = "{result = runQuery('./materialized-queries/query')} {result}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': sql,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': "SELECT * FROM {materializedRef('../query.sql')}",
        },
      },
    })
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source = await sourceManager.loadFromQuery('query')
    const materializeSource = await sourceManager.loadFromQuery(
      'materialized-queries/query',
    )
    materializeSource['_connector'] = new MaterializedConnector({
      source: materializeSource,
      connectionParams: {},
    })
    await expect(
      source.compileQuery({
        queryPath: 'query',
        params: {},
      }),
    ).rejects.toThrowError(
      new CompileError(
        'Error calling function: \nError Query reference to a parent, resulting in cyclic references.',
      ),
    )
  })
})
