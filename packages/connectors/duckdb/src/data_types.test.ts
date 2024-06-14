import fs from 'fs'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Parser } from 'json2csv'
import { CompiledQuery, SourceManager } from '@latitude-data/source-manager'
import path from 'path'
import { DataType } from '@latitude-data/query_result'
import DuckdbConnector from '.'

const QUERIES_DIR = 'src/tests/dummyApp'
const FULL_QUERIES_DIR = path.join(__dirname, 'tests/dummyApp')

function createTable(table: Record<string, unknown>[]) {
  const parser = new Parser()
  const csv = parser.parse(table)
  fs.writeFileSync(`${QUERIES_DIR}/table.csv`, csv)
}

describe('data type detection', async () => {
  beforeAll(() => {
    fs.writeFileSync(
      `${QUERIES_DIR}/query.sql`,
      `SELECT * FROM read_csv_auto('${FULL_QUERIES_DIR}/table.csv')`,
    )
  })

  afterAll(() => {
    fs.unlinkSync(`${QUERIES_DIR}/query.sql`)
    fs.unlinkSync(`${QUERIES_DIR}/table.csv`)
  })

  const sourceManager = new SourceManager(QUERIES_DIR)
  const source = await sourceManager.loadFromConfigFile('source.yml')
  const connector = new DuckdbConnector({ source, connectionParams: {} })
  source._connector = connector

  it('detects types from csv tables', async () => {
    createTable([
      {
        id: 1,
        name: 'Alice',
        age: 20,
        birthday: new Date('2022-01-01'),
        isAlive: true,
      },
      {
        id: 2,
        name: 'Bob',
        age: 30,
        birthday: new Date('2022-02-02'),
        isAlive: false,
      },
      {
        id: 3,
        name: 'Charlie',
        age: 40,
        birthday: new Date('2022-03-03'),
        isAlive: true,
      },
    ])

    const result = await source
      .compileQuery({ queryPath: 'query' })
      .then((compiledQuery: CompiledQuery) =>
        source.runCompiledQuery(compiledQuery),
      )
    expect(result.fields).toEqual([
      { name: 'id', type: DataType.Integer },
      { name: 'name', type: DataType.String },
      { name: 'age', type: DataType.Integer },
      { name: 'birthday', type: DataType.Datetime },
      { name: 'isAlive', type: DataType.Boolean },
    ])
  })
})
