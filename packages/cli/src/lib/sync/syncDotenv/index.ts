import config from '$src/config'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '$src/commands/constants'
import { existsSync } from 'fs'

export default function syncDotenv(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  if (watch) return

  const destPath = path.join(config.cwd, APP_FOLDER, '.env')
  const srcPath = path.join(config.cwd, '.env')

  // check if .env file exists before
  // syncing it to the app folder
  if (!existsSync(srcPath)) return

  syncFiles({
    srcPath,
    destPath,
    relativePath: '.env',
    type: 'add',
    ready: true,
  })
}
