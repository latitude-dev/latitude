import { CLIConfig } from '$src/config'
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

export default async function syncQueries({
  config,
  watch = false,
}: {
  config: CLIConfig
  watch?: boolean
}) {
  const rootDir = config.source
  const queriesDir = path.join(rootDir, 'queries')
  const destinationCsvsDir = path.join(rootDir, APP_FOLDER, 'queries')
  const destinationQueriesDir = path.join(
    rootDir,
    APP_FOLDER,
    'static',
    'latitude',
    'queries',
  )

  clearFolders([destinationQueriesDir, destinationCsvsDir])

  const syncFn = syncQueriesAndCsvs({
    rootDir,
    destinationCsvsDir,
    destinationQueriesDir,
  })

  if (watch) {
    await watcher(queriesDir, syncFn)
  } else {
    syncDirectory(queriesDir, syncFn)
  }

  onExit(() => {
    if (!watch) return

    clearFolders([destinationQueriesDir, destinationCsvsDir])
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
  return (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativePath = path
      .relative(rootDir, srcPath)
      .replace(/^queries\/?/, '')

    let destPath

    if (srcPath.endsWith('.csv')) {
      destPath = path.join(destinationCsvsDir, relativePath)
    } else if (
      srcPath.endsWith('.sql') ||
      srcPath.endsWith('.yml' || srcPath.endsWith('.yaml'))
    ) {
      destPath = path.join(destinationQueriesDir, relativePath)
    } else {
      return
    }

    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }
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
