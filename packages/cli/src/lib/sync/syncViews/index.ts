import colors from 'picocolors'
import config from '$src/config'
import fs from 'fs'
import path from 'path'
import rootPath from '$src/lib/rootPath'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '$src/commands/constants'
import watcher from '../shared/watcher'

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
  const rootDir = config.cwd
  const destinationDir = getRoutesFolderPath(rootDir, rootPath())
  const viewsDir = path.join(rootDir, 'views')
  const syncFn = syncFnFactory({ rootDir, destinationDir })

  if (watch) {
    await watcher(viewsDir, syncFn, {
      ignored: /(?!.*\/index\.html$)(^|[/\\])\../, // ignore all files except index.html
    })
  } else {
    syncDirectory(viewsDir, syncFn)
  }

  process.on('exit', onExit(watch))
}

export const syncFnFactory =
  ({ rootDir, destinationDir }: { rootDir: string; destinationDir: string }) =>
  (srcPath: string, type: 'add' | 'change' | 'unlink', ready: boolean) => {
    const relativeSrcPath = path
      .relative(rootDir, srcPath)
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

export const syncDirectory = (directory: string, syncFn: Function): void => {
  fs.readdirSync(directory).forEach((file: string) => {
    const srcPath = path.join(directory, file)

    // Check if the srcPath is a directory, and recursively call syncDirectory if it is
    if (fs.statSync(srcPath).isDirectory()) {
      syncDirectory(srcPath, syncFn)
    } else {
      // It's a file, perform the synchronization operation
      syncFn(srcPath, 'add', true)
    }
  })
}

const onExit = (watch: boolean) => () => {
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
}
