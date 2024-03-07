import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../constants'
import watcher from './common/watcher'
import syncFiles from './common/syncFiles'

export default async function watchQueries(rootDir: string) {
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

  await watcher(queriesDir, syncQueriesAndCsvs, {
    persistent: true,
  })

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
