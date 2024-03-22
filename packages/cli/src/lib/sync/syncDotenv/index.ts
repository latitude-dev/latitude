import { CLIConfig } from '$src/config'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { LATITUDE_SERVER_FOLDER } from '$src/commands/constants'
import { existsSync, rmSync } from 'fs'
import watcher from '../shared/watcher'
import { onExit } from '$src/utils'

export default async function syncDotenv(
  {
    watch = false,
  }: {
    watch?: boolean
  } = { watch: false },
) {
  const config = CLIConfig.getInstance()
  const destPath = path.join(config.source, LATITUDE_SERVER_FOLDER, '.env')
  const srcPath = path.join(config.source, '.env')

  if (watch) {
    await watcher(
      srcPath,
      (srcPath: string, type: 'add' | 'change' | 'unlink', ready: boolean) => {
        syncFiles({
          srcPath,
          destPath,
          type,
          ready,
          relativePath: '.env',
        })
      },
    )
  } else {
    if (!existsSync(srcPath)) return

    syncFiles({
      srcPath,
      destPath,
      relativePath: '.env',
      type: 'add',
      ready: true,
    })
  }

  onExit(() => {
    if (!watch) return

    if (existsSync(destPath)) rmSync(destPath)
  })
}
