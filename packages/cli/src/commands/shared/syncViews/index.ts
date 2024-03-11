import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import { APP_FOLDER } from '../../constants'
import config from '../../../config'
import watcher from '../shared/watcher'
import syncFiles from '../shared/syncFiles'
import rootPath from '../../../lib/rootPath'

function getRoutesFolderPath(cwd: string, rootPath: string | null): string {
  const basePath = path.join(cwd, APP_FOLDER, 'src', 'routes')
  return rootPath ? `${basePath}/${rootPath}` : basePath
}

const copiedFiles = new Set<string>()
export default async function syncViews(
  {
    watch = false,
  }: {
    watch?: boolean
  } = { watch: false },
): Promise<void> {
  const dataAppDir = config.cwd
  const destinationDir = getRoutesFolderPath(dataAppDir, rootPath())
  const views = path.join(dataAppDir, 'views')

  const syncFile = (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativeSrcPath = path
      .relative(dataAppDir, srcPath)
      .replace(/^views/, '')
    const relativePath = relativeSrcPath.replace(/[^/]*$/, '+page.svelte')
    const destPath = path.join(destinationDir, relativePath)

    if (type === 'add' || type === 'change') {
      copiedFiles.add(destPath)
    } else if (type === 'unlink') {
      copiedFiles.delete(destPath)
    }

    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }

  const syncDirectory = (directory: string): void => {
    fs.readdirSync(directory).forEach((file: string) => {
      const srcPath = path.join(directory, file)

      // Check if the srcPath is a directory, and recursively call syncDirectory if it is
      if (fs.statSync(srcPath).isDirectory()) {
        syncDirectory(srcPath)
      } else {
        // It's a file, perform the synchronization operation
        syncFile(srcPath, 'add', true)
      }
    })
  }

  if (watch) {
    await watcher(views, syncFile, {
      ignored: /(?!.*\/index\.html$)(^|[/\\])\../, // ignore all files except index.html
      persistent: true,
    })
  } else {
    syncDirectory(views)
  }

  process.on('exit', () => {
    if (!watch) return

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
