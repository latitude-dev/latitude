import QueryDisplay from './result_display'
import chokidar from 'chokidar'
import sourceManager, { QUERIES_DIR } from '../../src/lib/server/sourceManager'

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
    const source = await sourceManager.loadFromQuery(query)
    const compiledQuery = await source.compileQuery({
      queryPath: query,
      params,
    })

    if (debug) {
      QueryDisplay.displayCompiledQuery(compiledQuery)
      return
    }

    const startTime = Date.now()
    const result = await source.runCompiledQuery(compiledQuery)
    const totalTime = Date.now() - startTime

    QueryDisplay.displayResults(result, totalTime)
  } catch (e) {
    QueryDisplay.displayError(e as Error)
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
