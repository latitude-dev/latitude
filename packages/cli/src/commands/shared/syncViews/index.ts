import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import { APP_FOLDER, DEV_SITES_ROUTE_PREFIX } from '../../constants'
import config from '../../../config'
import watcher from '../shared/watcher'
import syncFiles from '../shared/syncFiles'

function getRoutesFolderPath(cwd: string, routePath: string | null): string {
  const basePath = path.join(cwd, APP_FOLDER, 'src', 'routes')
  return routePath ? `${basePath}/${routePath}` : basePath
}

const copiedFiles = new Set<string>()
export default async function syncViews({
  dataAppDir,
  appName,
  watch = false,
}: {
  dataAppDir: string
  appName: string
  watch?: boolean
}): Promise<void> {
  const routePath = config.pro ? null : `/${DEV_SITES_ROUTE_PREFIX}/${appName}`
  const destinationDir = getRoutesFolderPath(dataAppDir, routePath)
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

  if (watch) {
    await watcher(views, syncFile, {
      ignored: /(?!.*\/index\.html$)(^|[/\\])\../, // ignore all files except index.html
      persistent: true,
    })
  } else {
    fs.readdirSync(views).forEach((file: string) => {
      const srcPath = path.join(views, file)
      syncFile(srcPath, 'add', true)
    })
  }

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
