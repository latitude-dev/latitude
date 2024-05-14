import fs from 'fs'
import path from 'path'
import { StorageDriver } from '@/materialize/drivers'
import { DiskDriver } from '@/materialize/drivers'
import SourceManager from '@/manager'

class NoDiskDriverError extends Error {
  constructor() {
    super('Disk driver is required for materializing queries')
  }
}

class NonMaterializableQueryError extends Error {
  constructor(query: string) {
    super(`Query ${query} is not materializable`)
  }
}

function ensureMaterializeDirExists(storage: StorageDriver) {
  if (!(storage instanceof DiskDriver)) {
    throw new NoDiskDriverError()
  }

  const basePath = storage.basePath
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true })
  }
}

function parseTime({ start, end }: { start: number; end: number }) {
  const minuteTime = Math.floor((end - start) / 60000)
  const min = minuteTime.toString().padStart(2, '0')
  const secondsTime = ((end - start) % 60000) / 1000
  const seconds = minuteTime
    ? secondsTime.toFixed(0).padStart(2, '0')
    : secondsTime.toFixed(2).padStart(5, '0')
  return minuteTime ? `${min}:${seconds} minutes` : `${seconds} seconds`
}

function humanizeFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

function buildInfo({
  startTime,
  endTime,
  query,
  filePath,
  queryRows,
}: {
  startTime: number
  endTime: number
  query: string
  filePath: string
  queryRows: number
}) {
  const file = path.basename(filePath)
  return {
    query,
    queryRows: `${queryRows.toLocaleString('de-DE', {
      style: 'decimal',
      useGrouping: true,
    })} rows`,
    time: parseTime({ start: startTime, end: endTime }),
    fileSize: humanizeFileSize(fs.statSync(filePath).size),
    file,
  }
}

function recursiveFindQueriesInDir(
  rootDir: string,
  nextDir?: string,
): string[] {
  const dir = nextDir ?? rootDir
  const files = fs.readdirSync(dir)
  return files.flatMap((file) => {
    const fullPath = path.join(dir, file)
    const isDir = fs.statSync(fullPath).isDirectory()

    if (isDir) return recursiveFindQueriesInDir(rootDir, fullPath)

    const relativePath = fullPath.replace(rootDir, '').replace(/^\//, '')
    return fullPath.endsWith('.sql') ? [relativePath] : []
  })
}

async function isMaterializableQuery({
  sourceManager,
  query,
}: {
  sourceManager: SourceManager
  query: string
}) {
  const source = await sourceManager.loadFromQuery(query)
  const { config } = await source.getMetadataFromQuery(query)
  return config.materialize === true
}

async function findQueries({
  sourceManager,
  selected,
}: {
  sourceManager: SourceManager
  selected: string[]
}) {
  const storage = sourceManager.materializeStorage
  ensureMaterializeDirExists(storage)

  const queriesDir = sourceManager.queriesDir
  const allQueries = recursiveFindQueriesInDir(queriesDir)

  // We don' filter queries if user pass a specific list
  // If one of then is not materializable we fail
  if (selected.length > 0) {
    return Promise.all(
      allQueries
        .filter((query) =>
          selected.some(
            (selectedQuery) =>
              query === selectedQuery || query === `${selectedQuery}.sql`,
          ),
        )
        .map(async (query) => {
          const canMaterialize = await isMaterializableQuery({
            sourceManager,
            query,
          })

          if (!canMaterialize) {
            throw new NonMaterializableQueryError(query)
          }

          return query
        }),
    )
  }

  const queries = await Promise.all(
    allQueries.map(async (query) => {
      const canMaterialize = await isMaterializableQuery({
        sourceManager,
        query,
      })
      return { query, canMaterialize }
    }),
  )

  return queries.filter((q) => q.canMaterialize).map((q) => q.query)
}

type MaterializeInfo = {
  query: string
  file: string
  fileSize: string
  time: string
  queryRows: string
}

const BATCH_SIZE = 4096
type Result = {
  successful: boolean
  totalTime: string
  batchSize: number
  queriesInfo: MaterializeInfo[]
}
export default async function findAndMaterializeQueries({
  sourceManager,
  onStartQuery,
  onDebug,
  selectedQueries = [],
}: {
  selectedQueries?: string[]
  onStartQuery?: (_p: { count: number; index: number; query: string }) => void
  onDebug?: (_p: { memoryUsageInMb: string }) => void
  sourceManager: SourceManager
}): Promise<Result> {
  const startTotalTime = performance.now()
  const info: MaterializeInfo[] = []
  const result: Result = {
    batchSize: BATCH_SIZE,
    successful: false,
    totalTime: '',
    queriesInfo: [],
  }
  const storage = sourceManager.materializeStorage

  try {
    const queries = await findQueries({
      sourceManager,
      selected: selectedQueries,
    })

    for (const [index, query] of queries.entries()) {
      const startTime = performance.now()
      onStartQuery?.({ count: queries.length, index: index + 1, query })
      const materialize = await storage.writeParquet({
        onDebug,
        queryPath: query,
        params: {},
        batchSize: BATCH_SIZE,
      })

      const endTime = performance.now()
      info.push(
        buildInfo({
          startTime,
          endTime,
          query,
          filePath: materialize.filePath,
          queryRows: materialize.queryRows,
        }),
      )
    }
    result.successful = true
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(error)
    }
    result.successful = false
  } finally {
    const endTotalTime = performance.now()
    const totalTime = parseTime({ start: startTotalTime, end: endTotalTime })
    result.totalTime = totalTime
    result.queriesInfo = info
  }

  return result
}
