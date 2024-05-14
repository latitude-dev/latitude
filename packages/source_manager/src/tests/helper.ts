import { faker } from '@faker-js/faker'
import { BatchResponse, BatchedRow, ConnectorType } from '@/types'
import SourceManager from '@/manager'
import { Source } from '@/source'
import { resolve, join } from 'path'
import { DataType } from '@latitude-data/query_result'
export const ROOT_DIR = resolve(__dirname, '../../src/tests/dummyApp')
export const QUERIES_DIR = join(ROOT_DIR, 'queries')
export const MATERIALIZED_DIR = join(ROOT_DIR, 'materialized')

export async function getSource(queryPath: string, queriesDir = QUERIES_DIR) {
  const sourceManager = new SourceManager(queriesDir)
  return sourceManager.loadFromQuery(queryPath)
}

export function createDummySource() {
  const sourceManager = new SourceManager('queryDirPath')

  return new Source({
    path: 'path',
    schema: { type: ConnectorType.Mssql },
    sourceManager,
  })
}

export type FakeUser = {
  email: string
  firstName: string
  lastName: string
  admin: boolean
  iq: number
  createdAt: Date
}
type Batch = Omit<BatchResponse, 'lastBatch'>
export const createFakeUserDB = ({ amount }: { amount: number }): Batch => {
  const users: Batch = {
    rows: [],
    fields: [
      { name: 'email', type: DataType.String },
      { name: 'firstName', type: DataType.String },
      { name: 'lastName', type: DataType.String },
      { name: 'admin', type: DataType.Boolean },
      { name: 'iq', type: DataType.Float },
      { name: 'createdAt', type: DataType.Datetime },
    ],
  }

  for (let i = 0; i < amount; i++) {
    const user: BatchedRow = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      admin: Math.random() > 0.5 ? true : false,
      iq: parseFloat((Math.random() * (160 - 70) + 70).toFixed(2)),
      createdAt: faker.date.recent(),
    }
    users.rows.push(user)
  }

  return users
}
