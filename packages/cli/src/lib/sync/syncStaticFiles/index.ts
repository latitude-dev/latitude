import { rmSync } from 'fs'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '$src/commands/constants'
import watcher from '../shared/watcher'
import { onExit } from '$src/utils'
import config from '$src/config'
import { syncDirectory } from '$src/lib/sync/syncViews'

function getStaticFilesFolderPath(cwd: string): string {
  return path.join(cwd, APP_FOLDER, 'static')
}

const IGNORED_REGEX = /^.*(?:\/|^)(\..+|.+\.html)$/ // Ignore all html files and hidden files and directories (starting with a dot)

const copiedFiles = new Set<string>()

export default async function syncStaticFiles({
  watch = false,
}: {
  watch?: boolean
}): Promise<void> {
  const rootDir = config.rootDir
  const destinationDir = getStaticFilesFolderPath(rootDir)
  const viewsDir = path.join(rootDir, 'views')
  const syncFn = syncStaticFilesFn({ rootDir, destinationDir })

  if (watch) {
    await watcher(viewsDir, syncFn, {
      ignored: IGNORED_REGEX,
    })
  } else {
    syncDirectory(viewsDir, syncFn)
  }

  onExit(clearFiles(watch))
}

export function syncStaticFilesFn({
  rootDir,
  destinationDir,
}: {
  rootDir: string
  destinationDir: string
}) {
  return (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativePath = path
      .relative(rootDir, srcPath)
      .replace(/^views\/?/, '')

    const destPath = path.join(destinationDir, relativePath)

    if (type === 'add' || type === 'change') {
      copiedFiles.add(destPath)
    } else if (type === 'unlink') {
      copiedFiles.delete(destPath)
    }

    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }
}

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
