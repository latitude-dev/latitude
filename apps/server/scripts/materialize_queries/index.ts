import {
  findAndMaterializeQueries,
  MaterializationInfo,
} from '@latitude-data/source-manager'
import sourceManager from '../../src/lib/server/sourceManager'
import ora from 'ora'
import { parseArgs, type ParseArgsConfig } from 'node:util'

type CommandArgs = {
  debug: boolean
  selectedQueries: string[]
  force: boolean
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
  force: {
    type: 'boolean',
    short: 'f',
    default: false,
  },
}
function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  const { values } = parseArgs({
    args,
    options: OPTIONS as ParseArgsConfig['options'],
  })
  const {
    debug,
    queries: q,
    force,
  } = values as { debug: boolean; queries: string; force: boolean }
  const selectedQueries = q ? q?.split(' ') : []

  return { debug: debug ?? false, selectedQueries, force }
}

function humanizeFileSize(bytes: number) {
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  if (bytes < kb) return `${bytes} B`
  if (bytes < mb) return `${(bytes / kb).toFixed(2)} KB`
  if (bytes < gb) return `${(bytes / mb).toFixed(2)} MB`
  return `${(bytes / gb).toFixed(2)} GB`
}

function humanizeTime(time: number) {
  if (time < 60) return `${time} ms`
  const seconds = time / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  if (time < 60 * 1000) return `${(time / 1000).toFixed(2)} s`
  if (time < 60 * 60 * 1000)
    return `${minutes.toFixed(0)}:${(seconds % 60)
      .toString()
      .padStart(2, '0')} min`
  return `${hours.toFixed(0)}:${(minutes % 60).toString().padStart(2, '0')} h`
}

function removeIndex<Key extends string, T extends Record<Key, unknown>>(
  arr: T[],
  key: Key,
) {
  return arr.reduce<Record<string, Omit<T, Key>>>((acc, item) => {
    const { [key]: keyValue, ...rest } = item
    acc[String(keyValue)] = rest
    return acc
  }, {})
}

function successMaterializationToTable(
  materializations: MaterializationInfo[],
) {
  const table = materializations
    .filter((info) => info.cached || info.success)
    .map((info) => {
      if (info.cached === true) {
        return {
          queryPath: info.queryPath,
          cached: true,
          rows: undefined,
          fileSize: undefined,
          time: undefined,
        }
      }
      if (info.success === true) {
        return {
          queryPath: info.queryPath,
          cached: false,
          rows: info.rows,
          fileSize: humanizeFileSize(info.fileSize),
          time: humanizeTime(info.time),
        }
      }
      return info
    })
  return removeIndex(table, 'queryPath')
}

function failedMaterializationToTable(materializations: MaterializationInfo[]) {
  const table = materializations
    .filter((info) => info.cached === false && info.success === false)
    .map((info) => {
      return {
        queryPath: info.queryPath,
        error: info.error.message,
      }
    })
  return removeIndex(table, 'queryPath')
}

async function materializeQueries({
  debug,
  selectedQueries,
  force,
}: CommandArgs) {
  let spinner = ora().start('Starting materialization process')
  let currentText = ''
  let debugMessage = ''
  const updateProgress = () => {
    spinner.text = [currentText, debugMessage].filter(Boolean).join(' - ')
  }
  const result = await findAndMaterializeQueries({
    sourceManager,
    selectedQueries,
    force,
    onStartQuery: ({ count, index, query }) => {
      currentText = `[${index + 1}/${count}] ${query}`
      updateProgress()
    },
    onMaterialized: (info) => {
      if (info.cached) {
        spinner.stopAndPersist({
          symbol: '✔',
          text: `${currentText} - Already materialized`,
        })
      }
      if (info.cached === false && info.success) {
        spinner.succeed(`${currentText} - ${info.rows} rows`)
      }
      if (info.cached === false && info.success === false) {
        spinner.fail(`${currentText} - Failed: ${info.error.message}`)
      }
      spinner = ora().start()
    },
    onDebug: ({ memoryUsageInMb }: { memoryUsageInMb: string }) => {
      if (!debug) return
      debugMessage = `Memory: ${memoryUsageInMb}`
      updateProgress()
    },
  })

  spinner.stop()
  console.log('\n')

  if (result.materializations.length === 0) {
    console.log('No materializable queries have been found.')
  }

  if (result.materializations.some((info) => info.cached || info.success)) {
    console.log('Materialized queries:')
    console.table(successMaterializationToTable(result.materializations))
  }

  if (result.materializations.some((info) => !info.cached && !info.success)) {
    console.log('Failed queries:')
    console.table(failedMaterializationToTable(result.materializations))
  }

  console.log('Summary:')
  console.table({
    'Total time': `⏰ ${humanizeTime(result.totalTime)}`,
    'Materialized queries': result.materializations.filter(
      (info) => info.cached || info.success,
    ).length,
    'Materialized queries (new)': result.materializations.filter(
      (info) => !info.cached && info.success,
    ).length,
    'Materialized queries (cached)': result.materializations.filter(
      (info) => info.cached,
    ).length,
    'Failed queries': result.materializations.filter(
      (info) => !info.cached && !info.success,
    ).length,
  })

  process.exit(
    result.materializations.some((info) => !info.cached && !info.success)
      ? 1
      : 0,
  )
}

const args = getArgs()

materializeQueries(args)
