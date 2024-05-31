import fs, { rmSync } from 'fs'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '$src/commands/constants'
import watcher from '../shared/watcher'
import { onExit } from '$src/utils'
import config from '$src/config'

function getRoutesFolderPath(cwd: string): string {
  return path.join(cwd, APP_FOLDER, 'src', 'routes')
}

const copiedFiles = new Set<string>()
const IGNORED_FILES_REGEX = /^(?!.*index\.html$).*$/ // ignore all files except index.html

const clearFiles = (watch: boolean) => () => {
  if (!watch) return

  for (const copiedFile of copiedFiles) {
    try {
      rmSync(copiedFile, { recursive: true })
    } catch (e) {
      // do nothing
    }
  }
}

export const syncFnFactory =
  ({ rootDir, destinationDir }: { rootDir: string; destinationDir: string }) =>
  (srcPath: string, type: 'add' | 'change' | 'unlink', ready: boolean) => {
    if (!fs.existsSync(rootDir)) return
    if (IGNORED_FILES_REGEX.test(srcPath)) return

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
  if (!fs.existsSync(directory)) return

  fs.readdirSync(directory).forEach((file: string) => {
    const srcPath = path.join(directory, file)

    if (fs.statSync(srcPath).isDirectory()) {
      syncDirectory(srcPath, syncFn)
    } else {
      syncFn(srcPath, 'add', true)
    }
  })
}

export default async function syncViews({
  watch = false,
}: {
  watch?: boolean
}): Promise<void> {
  const rootDir = config.rootDir
  const destinationDir = getRoutesFolderPath(rootDir)
  const viewsDir = path.join(rootDir, 'views')
  const syncFn = syncFnFactory({ rootDir, destinationDir })

  if (watch) {
    await watcher(viewsDir, syncFn)
  } else {
    syncDirectory(viewsDir, syncFn)
  }

  onExit(clearFiles(watch))
}
