import fs from 'fs'
import { DiskDriver, StorageDriver } from '@latitude-data/source-manager'
import sourceManager from '../../src/lib/server/sourceManager'
import ora from 'ora'
import { parseArgs, type ParseArgsConfig } from 'node:util'

type CommandArgs = {
  debug: boolean
}

const OPTIONS = {
  debug: {
    type: 'boolean',
    short: 'd',
  },
}
function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  const { values } = parseArgs({
    args,
    options: OPTIONS as ParseArgsConfig['options'],
  })
  const { debug } = values as CommandArgs

  return { debug: debug ?? false }
}

function ensureMaterializeDirExists(storage: StorageDriver) {
  if (!(storage instanceof DiskDriver)) return

  const basePath = storage.basePath
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true })
  }
}

const BATCH_SIZE = 4096
async function materializeQueries(debug: boolean) {
  let startTime = 0
  if (debug) {
    startTime = performance.now()
  }
  const spinner = ora().start()
  const defaultArgs = debug
    ? {
        onDebug: ({ memoryUsageInMb }: { memoryUsageInMb: string }) => {
          spinner.text = `Memory: ${memoryUsageInMb}`
        },
      }
    : {}
  try {
    // TODO: This is faked. Do the logic to get only materializable queries
    const allQueries = ['postgresql/query']
    const storage = sourceManager.materializeStorage

    ensureMaterializeDirExists(storage)

    for (const [index, query] of allQueries.entries()) {
      const status = `${index + 1} of ${allQueries.length} ${query}`
      if (debug) {
        console.log(status)
      } else {
        spinner.text = status
      }
      const url = await storage.writeParquet({
        ...defaultArgs,
        queryPath: query,
        params: {},
        batchSize: BATCH_SIZE,
      })

      if (debug) {
        console.table({ query, batchSize: BATCH_SIZE, url })
        const endTime = performance.now()
        const min = Math.floor((endTime - startTime) / 60000)
          .toString()
          .padStart(2, '0')
        const seconds = (((endTime - startTime) % 60000) / 1000)
          .toFixed(2)
          .padStart(5, '0')
        console.log(`Time: ${min}:${seconds}`)
      }
    }

    spinner.stop()
    console.log('\nMaterialization complete 🎉')
    process.exit(0)
  } catch (e) {
    spinner.fail('Error materializing')
    console.error(e)
    process.exit(1)
  }
}

const args = getArgs()

materializeQueries(args.debug)
