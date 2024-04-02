import { QUERIES_DIR } from '../../src/lib/query_service/find_or_compute'
import findQueryFile from '@latitude-data/query_service'
import { createConnector } from '@latitude-data/connector-factory'
import QueryDisplay from './result_display'
import chokidar from 'chokidar'

type CommandArgs = {
  queryPath: string
  watch: boolean
  options: { [key: string]: string }
}

function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: run <query> <watch:true|false> [options]')
    process.exit(1)
  }
  const watch = args[1] === 'true'
  const queryPath = args[0]!
  let options
  try {
    options = args.length < 3 ? {} : JSON.parse(args[2]!)
  } catch (e) {
    console.error('Options must be a valid JSON string')
    process.exit(1)
  }
  return { queryPath, watch, options }
}

async function runQuery(query: string, options: { [key: string]: string }) {
  try {
    const { sourcePath, queryPath } = await findQueryFile(QUERIES_DIR, query)
    const connector = createConnector(sourcePath)

    const startTime = Date.now()
    const result = await connector.run({ queryPath, params: options })
    const totalTime = Date.now() - startTime

    QueryDisplay.displayResults(result, totalTime)
  } catch (e) {
    QueryDisplay.displayError(e)
  }
}

const args = getArgs()

if (args.watch) {
  const watcher = chokidar.watch(QUERIES_DIR, {
    ignored: /(^|[/\\])\../,
  })

  watcher.on('change', () => {
    runQuery(args.queryPath, args.options)
  })
}

QueryDisplay.render()
runQuery(args.queryPath, args.options)
