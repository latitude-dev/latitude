import config from '$src/config'
import path from 'path'
import watcher from '../shared/watcher'
import { APP_FOLDER } from '$src/commands/constants'
import syncFiles from '../shared/syncFiles'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'fs'
import { onExit } from '$src/utils'
import ensureConnectorInstalled from '$src/lib/sync/syncQueries/ensureConnectorInstalled'

function isSourceFile(srcPath: string) {
  return srcPath.endsWith('.yml') || srcPath.endsWith('.yaml')
}

function buildDestPath({
  rootDir,
  srcPath,
  destinationQueriesDir,
  destinationCsvsDir,
  isSource,
}: {
  rootDir: string
  srcPath: string
  destinationQueriesDir: string
  destinationCsvsDir: string
  isSource: boolean
}) {
  const relativePath = path
    .relative(rootDir, srcPath)
    .replace(/^queries\/?/, '')

  let destPath

  if (srcPath.endsWith('.csv')) {
    return {
      destPath: path.join(destinationCsvsDir, relativePath),
      relativePath,
    }
  }

  if (srcPath.endsWith('.sql') || isSource) {
    return {
      destPath: path.join(destinationQueriesDir, relativePath),
      relativePath,
    }
  }

  return { destPath, relativePath }
}

export function syncDirectory(dirPath: string, syncFn: Function): void {
  readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
    const currentPath = path.join(dirPath, dirent.name)
    if (dirent.isDirectory()) {
      syncDirectory(currentPath, syncFn)
    } else {
      syncFn(currentPath, 'add', true)
    }
  })
}

export function clearFolders(folders: string[]) {
  folders.forEach((folder) => {
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true })
    }

    readdirSync(folder).forEach((file: string) => {
      const filePath = path.join(folder, file)
      if (statSync(filePath).isDirectory()) {
        rmSync(filePath, { recursive: true })
      } else {
        unlinkSync(filePath)
      }
    })
  })
}

export function syncQueriesAndCsvs({
  rootDir,
  destinationCsvsDir,
  destinationQueriesDir,
}: {
  rootDir: string
  destinationCsvsDir: string
  destinationQueriesDir: string
}) {
  return async (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const isSource = isSourceFile(srcPath)
    const { destPath, relativePath } = buildDestPath({
      rootDir,
      srcPath,
      destinationQueriesDir,
      destinationCsvsDir,
      isSource,
    })

    // Not a valid extension .sql, .csv, .yml or .yaml
    if (!destPath) return

    await ensureConnectorInstalled({ rootDir, srcPath, isSource })
    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }
}

export default async function syncQueries({
  watch = false,
}: {
  watch?: boolean
}) {
  const rootDir = config.rootDir
  const queriesDir = path.join(rootDir, 'queries')
  const destinationCsvsDir = path.join(rootDir, APP_FOLDER, 'queries')
  const destinationQueriesDir = path.join(
    rootDir,
    APP_FOLDER,
    'static',
    '.latitude',
    'queries',
  )

  clearFolders([destinationQueriesDir, destinationCsvsDir])

  const syncFn = syncQueriesAndCsvs({
    rootDir,
    destinationCsvsDir,
    destinationQueriesDir,
  })

  if (watch) {
    await watcher(queriesDir, syncFn, { debug: config.verbose })
  } else {
    syncDirectory(queriesDir, syncFn)
  }

  onExit(() => {
    if (!watch) return

    clearFolders([destinationQueriesDir, destinationCsvsDir])
  })
}
