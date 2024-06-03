import colors from 'picocolors'
import config from '$src/config'
import fs from 'fs'
import path from 'path'
import { APP_SERVER_FOLDER } from '$src/commands/constants'
import { forceSymlink, onError } from '$src/utils'

function createAppFolder() {
  const target = path.resolve(config.appDir)

  try {
    fs.mkdirSync(target, { recursive: true })
  } catch (err) {
    onError({
      error: err as Error,
      message: `💥 Error creating folder ${config.appDir}`,
    })
  }

  return target
}

export default async function symlinkAppFromLocal(): Promise<boolean> {
  if (fs.existsSync(config.appDir)) return true

  const serverFolderInMonorepo = path.resolve(
    config.rootDir,
    `../../${APP_SERVER_FOLDER}`,
  )
  const dataApp = createAppFolder()

  try {
    await forceSymlink(serverFolderInMonorepo, dataApp)

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
