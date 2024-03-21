import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
import { APP_SERVER_FOLDER } from '$src/commands/constants'
import { forceSymlink, onError } from '$src/utils'
import { CLIConfig } from '$src/config'
import { type Props } from './index'

function createAppFolder() {
  const config = CLIConfig.getInstance()
  const target = path.resolve(config.appDir)
  fs.mkdirSync(target, { recursive: true })
  return target
}

export default async function synlinkAppFromLocal(_p: Props): Promise<boolean> {
  const serverFolderInMonorepo = path.resolve(
    process.cwd(),
    `../${APP_SERVER_FOLDER}`,
  )
  const dataApp = createAppFolder()

  try {
    forceSymlink(serverFolderInMonorepo, dataApp)
    console.log(
      colors.green(
        `✅ Latitude app linked to ${serverFolderInMonorepo} in ${dataApp}`,
      ),
    )
    return true
  } catch (err) {
    onError({ error: err as Error, message: `💥 Error linking server folder` })
    return false
  }
}
