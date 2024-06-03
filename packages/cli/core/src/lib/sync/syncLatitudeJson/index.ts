import config from '$src/config'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '$src/commands/constants'
import { existsSync, rmSync } from 'fs'
import watcher from '../shared/watcher'
import { onExit } from '$src/utils'

const filename = 'latitude.json'

export default async function syncLatitudeJson(
  {
    watch = false,
  }: {
    watch?: boolean
  } = { watch: false },
) {
  const destPath = path.join(
    config.rootDir,
    APP_FOLDER,
    'static/.latitude',
    filename,
  )
  const srcPath = path.join(config.rootDir, filename)

  if (watch) {
    await watcher(
      srcPath,
      (srcPath: string, type: 'add' | 'change' | 'unlink', ready: boolean) => {
        syncFiles({
          srcPath,
          destPath,
          type,
          ready,
          relativePath: filename,
        })
      },
    )
  } else {
    if (!existsSync(srcPath)) return

    syncFiles({
      srcPath,
      destPath,
      relativePath: filename,
      type: 'add',
      ready: true,
    })
  }

  onExit(() => {
    if (!watch) return

    if (existsSync(destPath)) rmSync(destPath)
  })
}
