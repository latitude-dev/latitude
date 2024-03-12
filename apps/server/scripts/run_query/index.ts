import findQueryFile, { ROOT_FOLDER } from '../../src/lib/query_service/findQueryFile'
import { createConnector } from '@latitude-data/connector-factory'
import { render, displayResults, displayError } from './result_display'
import chokidar from 'chokidar'

const args = process.argv.slice(2)
if (args.length < 1) {
  console.error('Usage: run <query> [options]')
  process.exit(1)
}
const watch = args[0] === '--watch'
const queryPath = args[0 + Number(watch)]
let options
try {
  options = args[1 + Number(watch)] ? JSON.parse(args[1 + Number(watch)]) : {}
} catch (e) {
  console.error('Options must be a valid JSON string')
  process.exit(1)
}

async function run(query: string, options: { [key: string]: string }) {
  try {
    const { sourcePath, queryPath } = await findQueryFile(query)
    const connector = createConnector(sourcePath)
    
    const startTime = Date.now()
    const result = await connector.run({ queryPath, params: options })
    const totalTime = Date.now() - startTime

    displayResults(result, totalTime)
  } catch (e) {
    displayError(e)
  }
}

if (watch) {
  const watcher = chokidar.watch(ROOT_FOLDER, {
    ignored: /(^|[/\\])\../,
    persistent: true,
  })
  
  watcher.on('change', () => {
    run(queryPath, options)
  })
}

render()
run(queryPath, options)