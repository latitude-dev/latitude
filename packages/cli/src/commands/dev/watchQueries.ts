import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../constants'
import watcher from './common/watcher'
import output from './common/output'

function getQueriesPath(cwd: string): string {
  return path.join(cwd, APP_FOLDER, 'static', 'latitude', 'queries')
}

export default async function watchQueries(dir: string) {
  const queriesPath = getQueriesPath(dir)
  const queries = path.join(dir, 'queries')

  clearInternalQueriesFolder(queriesPath)

  const syncFile = (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativePath = path.relative(queries, srcPath)
    const destPath = path.join(queriesPath, relativePath)

    if (type === 'add' || type === 'change') {
      // Make sure all directories in the path exist
      fs.mkdirSync(path.dirname(destPath), { recursive: true })

      fs.copyFile(srcPath, destPath, (err) => {
        if (err) {
          return output(
            colors.red(
              `${relativePath} could not be copied to ${destPath}: ${err}`,
            ),
            ready,
          )
        } else {
          output(colors.gray(`${relativePath} synced`), ready)
        }
      })
    } else if (type === 'unlink') {
      fs.unlink(destPath, (err) => {
        if (err) {
          output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
        }
      })
    }
  }

  await watcher(queries, syncFile, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
  })

  console.log(colors.green('Watching [queries]...'))

  process.on('exit', () => {
    clearInternalQueriesFolder(queriesPath)
  })
}

/**
 * Clears the internal queries folder by deleting all files and subfolders.
 */
function clearInternalQueriesFolder(queriesPath: string) {
  if (!fs.existsSync(queriesPath)) {
    fs.mkdirSync(queriesPath, { recursive: true })
  }

  fs.readdirSync(queriesPath).forEach((file: string) => {
    const filePath = path.join(queriesPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true })
    } else {
      fs.unlinkSync(filePath)
    }
  })
}
