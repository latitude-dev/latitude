import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
import { APP_FOLDER, APP_SERVER_FOLDER } from '../../commands/constants'
import { Props } from './index'
import { forceSymlink } from '../../utils'
import config from '../../config'

function createAppFolder() {
  const target = path.resolve(`${config.cwd}/${APP_FOLDER}`)
  fs.mkdirSync(target, { recursive: true })
  return target
}

export default async function synlinkAppFromLocal({ onError }: Props) {
  const serverFolderInMonorepo = path.resolve(
    process.cwd(),
    `./${APP_SERVER_FOLDER}`,
  )
  const dataApp = createAppFolder()

  try {
    forceSymlink(serverFolderInMonorepo, dataApp)
    console.log(
      colors.green(
        `✅ Latitude app linked to ${serverFolderInMonorepo} in ${dataApp}`,
      ),
    )
  } catch (err) {
    onError({ error: err as Error, message: `💥 Error linking server folder` })
  }
}
