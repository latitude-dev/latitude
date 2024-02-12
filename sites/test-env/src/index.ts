import { createConnector } from '@latitude-dev/connector-factory'
import { ConnectionError, QueryError, ConnectorError, SyntaxError } from '@latitude-dev/base-connector'
import fs from 'fs';

async function main() {
  try {

    const connector = createConnector('sql')
    const params = JSON.parse(fs.readFileSync('sql/params.json', 'utf8'));

    const result = await connector.query({
      queryPath: 'main',
      params
    })

    console.table(result.rows.map((row: unknown[]) => row.reduce((acc: Record<string, unknown>, value: unknown, index: number) => ({...acc, [result.fields[index]!.name]: value}), {})))

  } catch (error: unknown) {
    if (error instanceof ConnectionError)     console.error('🔌 CONNECTION ERROR')
    else if (error instanceof QueryError)     console.error('📄 QUERY ERROR')
    else if (error instanceof ConnectorError) console.error('🤷‍♂️ GENERIC CONNECTOR ERROR')
    else if (error instanceof SyntaxError)    console.error('📝 SYNTAX ERROR')
    else console.error('❌ UNKNOWN ERROR')

    console.error(error)
  }
}

main()