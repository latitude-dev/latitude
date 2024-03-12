import config from '../../../config'
import path from 'path'
import syncFiles from '../shared/syncFiles'
import { APP_FOLDER } from '../../../commands/constants'

export default function syncDotenv(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  if (watch) return

  const destPath = path.join(config.cwd, APP_FOLDER, '.env')
  const srcPath = path.join(config.cwd, '.env')

  syncFiles({
    srcPath,
    destPath,
    relativePath: '.env',
    type: 'add',
    ready: true,
  })
}
