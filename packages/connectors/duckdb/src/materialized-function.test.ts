import mockFs from 'mock-fs'
import fs from 'fs'
import { describe, it, expect } from 'vitest'
import { QUERIES_DIR, buildMaterializedConnector } from '$/tests/helpers'
import {
  CompileError,
  SourceManager,
  buildDefaultContext,
} from '@latitude-data/source-manager'
import MaterializedConnector from '$/index'
import path from 'path'

const MATERIALIZED_SQL = `
{@config materialize = true}
SELECT * FROM users
`
describe('materialized function', async () => {
  it('find queries in a folder out of current source', async () => {
    const sql = "SELECT * FROM {materialized('../query.sql')}"
    const queriesFs = {
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': MATERIALIZED_SQL,
        'materialized-queries': {
          'source.yml': 'type: materialized',
          'query.sql': sql,
        },
      },
    }
    mockFs(queriesFs)

    const sourceManager = new SourceManager(QUERIES_DIR)
    const expectedPath = await sourceManager.materializationUrl('query')

    if (!fs.existsSync(expectedPath)) {
      fs.mkdirSync(path.dirname(expectedPath), { recursive: true })
    }
    fs.writeFileSync(expectedPath, 'PARQUET_QUERY_CONTENT') // Not important in this tests

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
    expect(compiled.sql).toBe(`SELECT * FROM read_parquet('${expectedPath}')`)
  })

  it('fails when materialized sql is not found', async () => {
    const sql = "SELECT * FROM {materialized('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': `
          {@config materialize = true}
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
        "Error calling function: \nMaterializedFileNotFoundError Query 'query.sql' is not materialized. Run 'latitude materialize' to materialize it.",
      ),
    )
  })

  it('fails when ref query is not a string', async () => {
    const sql = 'SELECT * FROM {materialized(33)}'
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
    const sql = "SELECT * FROM {materialized('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': `
          { @config materialize = true }
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
        'Error calling function: \nError Referenced query must be static. It can not contain any of the following methods: param',
      ),
    )
  })

  it('fails when used materialized config is not defined', async () => {
    const sql = "SELECT * FROM {materialized('../query.sql')}"
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
        "Error calling function: \nError Query 'query.sql' is not configured to be materialized. You can materialize it by adding {@config materialize = true}.",
      ),
    )
  })

  it('fails when used materialized config is set to false', async () => {
    const sql = "SELECT * FROM {materialized('../query.sql')}"
    mockFs({
      [QUERIES_DIR]: {
        'source.yml': 'type: internal_test',
        'query.sql': '{@config materialize = false}\nSELECT * FROM users',
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
        "Error calling function: \nError Query 'query.sql' is not configured to be materialized. You can materialize it by adding {@config materialize = true}.",
      ),
    )
  })

  it('fails when used in a logic block', async () => {
    const sql = "{result = materialized('../query')} {result}"
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
        "Function 'materialized' cannot be used inside a logic block. It must be directly interpolated into the query",
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
          'query.sql': "SELECT * FROM {materialized('../query.sql')}",
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
