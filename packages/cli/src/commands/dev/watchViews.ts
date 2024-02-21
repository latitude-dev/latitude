import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../constants'
import watcher from './common/watcher'
import output from './common/output'

const INTERNAL_VIEWS_FOLDER = path.join(
  process.cwd(),
  APP_FOLDER,
  'src',
  'routes',
)

const copiedFiles: Set<string> = new Set()

export default async function watchViews(dir: string): Promise<void> {
  const syncFile = (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativeSrcPath = path.relative(dir, srcPath)
    const relativePath = relativeSrcPath.replace(/[^/]*$/, '+page.svelte')
    const destPath = path.join(INTERNAL_VIEWS_FOLDER, relativePath)

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
          output(colors.gray(`${relativeSrcPath} synced`), ready)
        }
      })

      copiedFiles.add(destPath)
    } else if (type === 'unlink') {
      fs.unlink(destPath, (err) => {
        if (err) {
          output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
        } else {
          copiedFiles.delete(destPath)
        }
      })
    }
  }

  await watcher(dir, syncFile, {
    ignored: /(?!.*\/index\.html$)(^|[/\\])\../, // ignore all files except index.html
    persistent: true,
  })

  process.on('exit', () => {
    for (const copiedFile of copiedFiles) {
      fs.unlink(copiedFile, (err) => {
        if (err) {
          console.log(
            colors.red(`File ${copiedFile} could not be deleted: ${err}`),
          )
        }
      })
    }
  })
}
