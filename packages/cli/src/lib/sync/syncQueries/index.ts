import config from '../../../config'
import fs from 'fs'
import path from 'path'
import watcher from '../shared/watcher'
import { APP_FOLDER } from '../../../commands/constants'
import syncFiles from '../shared/syncFiles'

export default async function syncQueries({
  watch = false,
  silent = false,
}: {
  watch?: boolean
  silent?: boolean
} = {}) {
  const rootDir = config.cwd
  const queriesPath = path.join(
    rootDir,
    APP_FOLDER,
    'static',
    'latitude',
    'queries',
  )
  const csvsPath = path.join(rootDir, APP_FOLDER, 'queries')

  clearFolders([queriesPath, csvsPath])

  const syncQueriesAndCsvs = (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativePath = path.relative(rootDir, srcPath).replace(/^queries/, '')

    let destPath

    if (srcPath.endsWith('.csv')) {
      destPath = path.join(csvsPath, relativePath)
    } else if (
      srcPath.endsWith('.sql') ||
      srcPath.endsWith('.yml' || srcPath.endsWith('.yaml'))
    ) {
      destPath = path.join(queriesPath, relativePath)
    } else {
      return
    }

    syncFiles({ srcPath, relativePath, destPath, type, ready, silent })
  }

  const queriesDir = path.join(rootDir, 'queries')
  const syncDirectory = (dirPath: string): void => {
    fs.readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
      const currentPath = path.join(dirPath, dirent.name)
      if (dirent.isDirectory()) {
        syncDirectory(currentPath)
      } else {
        syncQueriesAndCsvs(currentPath, 'add', true)
      }
    })
  }

  if (watch) {
    await watcher(queriesDir, syncQueriesAndCsvs, {
      persistent: true,
    })
  } else {
    syncDirectory(queriesDir)
  }

  process.on('exit', () => {
    if (!watch) return

    clearFolders([queriesPath, csvsPath])
  })
}

function clearFolders(folders: string[]) {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }

    fs.readdirSync(folder).forEach((file: string) => {
      const filePath = path.join(folder, file)
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true })
      } else {
        fs.unlinkSync(filePath)
      }
    })
  })
}
