import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../../constants'
import syncFiles from '../shared/syncFiles'
import watcher from '../shared/watcher'

export default async function syncQueries({
  rootDir,
  watch = false,
}: {
  rootDir: string
  watch?: boolean
}) {
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

    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }

  const queriesDir = path.join(rootDir, 'queries')

  if (watch) {
    await watcher(queriesDir, syncQueriesAndCsvs, {
      persistent: true,
    })
  } else {
    fs.readdirSync(queriesDir).forEach((file: string) => {
      const srcPath = path.join(queriesDir, file)
      syncQueriesAndCsvs(srcPath, 'add', true)
    })
  }

  process.on('exit', () => {
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
