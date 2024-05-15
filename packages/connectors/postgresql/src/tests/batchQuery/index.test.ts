import { describe, beforeAll, it, expect } from 'vitest'
import mockFs from 'mock-fs'
import {
  BatchedRow,
  buildDefaultContext,
  SourceManager,
} from '@latitude-data/source-manager'
import createFixtures from '../fixtures'
import PostgresConnector from '../../index'
import { DataType, Field } from '@latitude-data/query_result'

const QUERIES_DIR = '/queries'
export async function getSource(queryPath: string) {
  const sourceManager = new SourceManager(QUERIES_DIR)
  return sourceManager.loadFromQuery(queryPath)
}
const POSTGRES_CONFIG = `
type: postgres
details:
  database: postgresql_adapter_test
  user: latitude
  password: secret
  host: localhost
  port: 5436
  schema: public
  ssl: false
`
const SQL = 'SELECT * FROM batched_users'
describe('batchedQuery', () => {
  beforeAll(async () => {
    mockFs({
      [QUERIES_DIR]: { 'source.yml': POSTGRES_CONFIG, 'query.sql': SQL },
      '/tmp/.latitude': {},
    })
    await createFixtures()
  })

  it('runs a query in batches', async () => {
    const source = await getSource('query')
    const connectionParams = source.connectionParams
    const connector = new PostgresConnector({
      source,
      connectionParams,
    })
    const compiledQuery = await connector.compileQuery({
      ...buildDefaultContext(),
      request: {
        queryPath: 'query',
        sql: SQL,
        params: {},
      },
    })
    const results: BatchedRow[] = []
    let batchFields: Field[] = []
    await connector.batchQuery(compiledQuery, {
      batchSize: 10,
      onBatch: async ({ rows, fields }) => {
        if (batchFields.length <= 0) {
          batchFields = fields
        }
        results.push(...rows)
      },
    })

    expect(results.length).toBe(30)
    expect(batchFields).toEqual([
      { name: 'id', type: DataType.Integer },
      { name: 'name', type: DataType.String },
      { name: 'lastname', type: DataType.String },
      { name: 'email', type: DataType.String },
      { name: 'updated_at', type: DataType.Datetime },
      { name: 'created_at', type: DataType.Datetime },
    ])
    expect(results[0]).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      lastname: expect.any(String),
      email: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    })
  })
})
