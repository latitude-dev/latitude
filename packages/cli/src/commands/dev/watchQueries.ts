import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../constants'

const chokidar = require('chokidar')
const INTERNAL_QUERIES_FOLDER = path.join(
  process.cwd(),
  APP_FOLDER,
  'static',
  'latitude',
  'queries',
)

export default function watchQueries(dir: string) {
  clearInternalQueriesFolder()

  // Initialize watcher.
  const watcher = chokidar.watch(dir, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
  })

  const syncFile = (srcPath: string, type: 'add' | 'change' | 'unlink') => {
    const relativePath = path.relative(dir, srcPath)
    const destPath = path.join(INTERNAL_QUERIES_FOLDER, relativePath)

    if (type === 'add' || type === 'change') {
      // Make sure all directories in the path exist
      fs.mkdirSync(path.dirname(destPath), { recursive: true })

      fs.copyFile(srcPath, destPath, (err) => {
        if (err) {
          return console.error(
            colors.red(
              `File ${relativePath} could not be copied to ${destPath}: ${err}`,
            ),
          )
        } else {
          console.log(colors.gray(`\n File ${relativePath} synced`))
        }
      })
    } else if (type === 'unlink') {
      fs.unlink(destPath, (err) => {
        if (err) {
          console.error(
            colors.red(`File ${destPath} could not be deleted: ${err}`),
          )
        }
      })
    }
  }

  // Event listeners.
  watcher
    .on('add', (path: string) => {
      syncFile(path, 'add')
    })
    .on('change', (path: string) => {
      syncFile(path, 'change')
    })
    .on('unlink', (path: string) => {
      syncFile(path, 'unlink')
    })
    .on('error', (error: Error) => console.error(`Watcher error: ${error}`))
    .on('ready', () =>
      console.log(
        colors.gray('Initial scan completed. Watching queries for changes...'),
      ),
    )

  // On exit remove contents in APP_FOLDER and close watcher
  process.on('SIGINT', () => {
    console.log(colors.red('Exiting...'))
    watcher.close
    clearInternalQueriesFolder()
    process.exit()
  })
}

/**
 * Clears the internal queries folder by deleting all files and subfolders.
 */
function clearInternalQueriesFolder() {
  if (!fs.existsSync(INTERNAL_QUERIES_FOLDER)) {
    fs.mkdirSync(INTERNAL_QUERIES_FOLDER, { recursive: true })
  }

  fs.readdirSync(INTERNAL_QUERIES_FOLDER).forEach((file: string) => {
    const filePath = path.join(INTERNAL_QUERIES_FOLDER, file)
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmdirSync(filePath, { recursive: true })
    } else {
      fs.unlinkSync(filePath)
    }
  })
}
