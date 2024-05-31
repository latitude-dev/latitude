import { Pool, PoolClient } from 'pg'
import { faker } from '@faker-js/faker'

const DB_POOL = new Pool({
  host: 'localhost',
  database: 'postgresql_adapter_test',
  user: 'latitude',
  password: 'secret',
  port: 5436,
})

async function usersFixtures({ client }: { client: PoolClient }) {
  const createTableText = `
    CREATE TABLE IF NOT EXISTS batched_users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      lastName VARCHAR(100),
      email VARCHAR(100),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
    )
  `
  await client.query(createTableText)

  const existingRows = await client.query('SELECT COUNT(*) FROM batched_users')

  if (parseInt(existingRows.rows[0].count, 10) > 0) {
    return
  }

  // Insert 30 rows into the batched_users table
  for (let i = 0; i < 30; i++) {
    const insertText = `
      INSERT INTO batched_users(name, lastName, email, updated_at, created_at)
      VALUES($1, $2, $3, $4, $5)
    `
    const insertValues = [
      faker.person.firstName(),
      faker.person.lastName(),
      faker.internet.email(),
      new Date(),
      new Date(),
    ]
    await client.query(insertText, insertValues)
  }
}

let fixturesRun = false
export default async function createFixtures() {
  if (fixturesRun) {
    return
  }

  let client: PoolClient | null = null
  try {
    const client = await DB_POOL.connect()
    await client.query('BEGIN')
    await usersFixtures({ client })
    await client.query('COMMIT')
  } catch (e) {
    console.error(e)
    if (client) {
      await (client as PoolClient).query('ROLLBACK')
    }
    throw e
  } finally {
    fixturesRun = true
    if (client) {
      ;(client as PoolClient).release()
    }
  }
}
