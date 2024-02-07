import { PostgresConnector } from '@latitude-dev/postgresql-connector'
import { ConnectionError, QueryError, ConnectorError } from '@latitude-dev/base-connector'

async function main() {
  try {
    const connector = new PostgresConnector({
      database: '...',
      user: '...',
      password: '...',
      host: '...',
      port: 5432,
    })

    // Example query
    const result = await connector.query({ sql: 'SELECT * FROM user' })

    console.log(result)

  } catch (error: unknown) {

    if (error instanceof ConnectionError) {
      console.error('🔌 CONNECTION ERROR')

    } else if (error instanceof QueryError) {
      console.error('💬 QUERY ERROR')

    } else if (error instanceof ConnectorError) {
      console.error('🤷‍♂️ GENERIC CONNECTOR ERROR')

    } else {
      console.error('❌ UNKNOWN ERROR')
    }

    console.error(error)
  }
}

main()