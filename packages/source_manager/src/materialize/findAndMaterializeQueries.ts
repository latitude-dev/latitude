import fs from 'fs'
import path from 'path'
import SourceManager from '@/manager'
import { StorageDriver } from './drivers'

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

export async function findAllMaterializableQueries(
  sourceManager: SourceManager,
) {
  const queriesDir = sourceManager.queriesDir
  const allQueries = recursiveFindQueriesInDir(queriesDir)

  const materializableQueries = await Promise.all(
    allQueries.map(async (queryPath: string) => {
      const source = await sourceManager.loadFromQuery(queryPath)
      const { config } = await source.getMetadataFromQuery(queryPath)
      return config.materialize === true ? queryPath : null
    }),
  )

  return materializableQueries.filter(Boolean) as string[]
}

interface IMaterializationInfo {
  queryPath: string
  cached: boolean
}

interface CachedMaterializationInfo extends IMaterializationInfo {
  cached: true
}

interface IMissMaterializationInfo extends IMaterializationInfo {
  cached: false
  success: boolean
}

interface SuccessMaterializationInfo extends IMissMaterializationInfo {
  cached: false
  success: true
  rows: number
  fileSize: number
  time: number
}

interface FailedMaterializationInfo extends IMissMaterializationInfo {
  cached: false
  success: false
  error: Error
}

export type MaterializationInfo =
  | CachedMaterializationInfo
  | SuccessMaterializationInfo
  | FailedMaterializationInfo

async function materializeQuery({
  storage,
  queryPath,
  onDebug,
  force,
}: {
  storage: StorageDriver
  queryPath: string
  onDebug?: (_p: { memoryUsageInMb: string }) => void
  force?: boolean
}): Promise<MaterializationInfo> {
  if (!force && (await storage.isMaterialized(queryPath))) {
    return {
      queryPath,
      cached: true,
    }
  }

  try {
    const startTime = performance.now()
    const materialized = await storage.materialize({
      onDebug,
      queryPath,
      batchSize: BATCH_SIZE,
    })
    const endTime = performance.now()
    return {
      queryPath,
      cached: false,
      success: true,
      rows: materialized.rows,
      fileSize: materialized.fileSize,
      time: endTime - startTime,
    }
  } catch (error) {
    return {
      queryPath,
      cached: false,
      success: false,
      error: error as Error,
    }
  }
}

const BATCH_SIZE = 4096
type Result = {
  totalTime: number
  materializations: MaterializationInfo[]
}
export default async function findAndMaterializeQueries({
  sourceManager,
  onStartQuery,
  onMaterialized,
  onDebug,
  selectedQueries = [],
  force = false,
}: {
  selectedQueries?: string[]
  onStartQuery?: (_p: { count: number; index: number; query: string }) => void
  onMaterialized?: (info: MaterializationInfo) => void
  onDebug?: (_p: { memoryUsageInMb: string }) => void
  sourceManager: SourceManager
  force?: boolean
}): Promise<Result> {
  const startTotalTime = performance.now()

  const storage = sourceManager.materializeStorage
  const queries = selectedQueries.length
    ? selectedQueries
    : await findAllMaterializableQueries(sourceManager)

  const materializations: MaterializationInfo[] = []
  for (let index = 0; index < queries.length; index++) {
    const queryPath = queries[index]!
    onStartQuery?.({
      index,
      count: queries.length,
      query: queryPath,
    })
    const materializationInfo = await materializeQuery({
      storage,
      queryPath,
      onDebug,
      force,
    })
    materializations.push(materializationInfo)
    onMaterialized?.(materializationInfo)
  }

  const endtotalTime = performance.now()
  return {
    totalTime: endtotalTime - startTotalTime,
    materializations,
  }
}
