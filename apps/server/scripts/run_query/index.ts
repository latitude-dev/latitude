import { QUERIES_DIR } from '../../src/lib/query_service/find_or_compute'
import findQueryFile from '@latitude-data/query_service'
import { createConnector } from '@latitude-data/connector-factory'
import QueryDisplay from './result_display'
import chokidar from 'chokidar'

type CommandArgs = {
  queryPath: string
  parameters: { [key: string]: string }
  watch: boolean
  debug: boolean
}

function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error(
      'Usage: run <query> [parameters] <watch:true|false> <debug:true|false>',
    )
    process.exit(1)
  }
  const queryPath = args[0]!

  let parameters: CommandArgs['parameters']
  try {
    parameters = args.length < 3 ? {} : JSON.parse(args[1]!)
  } catch (e) {
    console.error('Parameters must be a valid JSON string')
    process.exit(1)
  }

  const watch = args[2] === 'true'
  const debug = args[3] === 'true'

  return { queryPath, parameters, watch, debug }
}

async function runQuery(
  query: string,
  params: { [key: string]: string },
  debug = false,
) {
  try {
    const { sourcePath, queryPath } = await findQueryFile(QUERIES_DIR, query)
    const connector = await createConnector(sourcePath)

    if (debug) {
      const compiledQuery = await connector.compileQuery({ queryPath, params })
      QueryDisplay.displayCompiledQuery({
        sql: compiledQuery.compiledQuery,
        params: compiledQuery.resolvedParams,
      })
      return
    }

    const startTime = Date.now()
    const result = await connector.run({ queryPath, params })
    const totalTime = Date.now() - startTime

    QueryDisplay.displayResults(result, totalTime)
  } catch (e) {
    QueryDisplay.displayError(e)
  }
}

const args = getArgs()

if (args.watch) {
  const watcher = chokidar.watch(QUERIES_DIR)
  watcher.on('change', () => {
    runQuery(args.queryPath, args.parameters, args.debug)
  })
}

QueryDisplay.render()
runQuery(args.queryPath, args.parameters, args.debug)
