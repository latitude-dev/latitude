import SourceManager from '@/manager'
import { MaterializationInfo } from '..'
import fs from 'fs'
import path from 'path'

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

type Result = {
  totalTime: number
  materializations: MaterializationInfo[]
}

export default async function findAndMaterializeQueries({
  sourceManager,
  onStartQuery,
  onMaterialized,
  selectedQueries = [],
  force = false,
}: {
  selectedQueries?: string[]
  onStartQuery?: (_p: { count: number; index: number; query: string }) => void
  onMaterialized?: (info: MaterializationInfo) => void
  sourceManager: SourceManager
  force?: boolean
}): Promise<Result> {
  const startTotalTime = performance.now()

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
    const materializationInfo = await sourceManager.materializeQuery({
      queryPath,
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
