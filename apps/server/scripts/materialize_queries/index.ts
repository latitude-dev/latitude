import { findAndMaterializeQueries } from '@latitude-data/source-manager'
import sourceManager from '../../src/lib/server/sourceManager'
import ora from 'ora'
import { parseArgs, type ParseArgsConfig } from 'node:util'

type CommandArgs = {
  debug: boolean
  selectedQueries: string[]
}

function removeIndex<Key extends string, T extends Record<Key, unknown>>(
  arr: T[],
  key: Key,
) {
  return arr.reduce<Record<string, Omit<T, Key>>>((acc, item) => {
    acc[key] = item
    return acc
  }, {})
}

const OPTIONS = {
  debug: {
    type: 'boolean',
    short: 'd',
  },
  queries: {
    type: 'string',
    short: 'q',
  },
}
function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  const { values } = parseArgs({
    args,
    options: OPTIONS as ParseArgsConfig['options'],
  })
  const { debug, queries: q } = values as { debug: boolean; queries: string }
  const selectedQueries = q ? q?.split(' ') : []

  return { debug: debug ?? false, selectedQueries }
}

async function materializeQueries({ debug, selectedQueries }: CommandArgs) {
  const spinner = ora().start()
  let runningQuery = ''
  const result = await findAndMaterializeQueries({
    sourceManager,
    selectedQueries,
    onStartQuery: ({ count, index, query }) => {
      runningQuery = `${index} of ${count} ${query}`
    },
    onDebug: ({ memoryUsageInMb }: { memoryUsageInMb: string }) => {
      spinner.text = `${runningQuery} - Memory: ${memoryUsageInMb}`
    },
  })

  spinner.stop()
  console.log('\n\n')

  const materializedTables = removeIndex(result.queriesInfo, 'query')

  if (Object.keys(materializedTables).length > 0) {
    if (result.successful) {
      console.log('\nMaterialization complete 🎉')
    }

    const generalTable = removeIndex(
      [
        {
          totalTime: `⏰ ${result.totalTime}`,
          ...(debug ? { batchSize: result.batchSize } : {}),
        },
      ],
      'totalTime',
    )

    console.table(generalTable)
    console.table(materializedTables)
  } else {
    console.log('No queries to materialize')
  }

  process.exit(result.successful ? 0 : 1)
}

const args = getArgs()

materializeQueries(args)
