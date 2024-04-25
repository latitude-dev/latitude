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
import isSourceFile from '$src/lib/isSourceFile'

function buildDestPath({
  srcPath,
  destinationQueriesDir,
  destinationCsvsDir,
}: {
  srcPath: string
  destinationQueriesDir: string
  destinationCsvsDir: string
}) {
  const relativePath = path
    .relative(config.rootDir, srcPath)
    .replace(/^queries\/?/, '')

  let destPath

  if (srcPath.endsWith('.csv')) {
    return {
      destPath: path.join(destinationCsvsDir, relativePath),
      relativePath,
    }
  }

  if (srcPath.endsWith('.sql') || isSourceFile(srcPath)) {
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
  destinationCsvsDir,
  destinationQueriesDir,
}: {
  destinationCsvsDir: string
  destinationQueriesDir: string
}) {
  return async (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const { destPath, relativePath } = buildDestPath({
      srcPath,
      destinationQueriesDir,
      destinationCsvsDir,
    })

    // Not a valid extension .sql, .csv, .yml or .yaml
    if (!destPath) return

    syncFiles({ srcPath, relativePath, destPath, type, ready })
    await ensureConnectorInstalled(destPath, type)
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
  const destinationQueriesDir = config.queriesDir

  clearFolders([destinationQueriesDir, destinationCsvsDir])

  const syncFn = syncQueriesAndCsvs({
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
