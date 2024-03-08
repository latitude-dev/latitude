import fsExtra from 'fs-extra'
import path from 'path'
import config from '../../config'
import runLatitudeServer, { getDefaultCwd } from './runLatitudeServer'
import setupApp from '../../lib/setupApp'
import { onError } from '../../utils'
import { LATITUDE_FOLDER } from '../constants'
import { CommonCLIArgs } from '../../types'

async function maybeSetupApp(appFolder: string) {
  const hasApp = fsExtra.existsSync(path.join(appFolder, LATITUDE_FOLDER))

  if (hasApp) return true

  // TODO: Pick version from `latitude.json`.
  return setupApp({
    onError,
    destinationPath: appFolder,
  })
}

type Args = CommonCLIArgs & { open?: string }
export default async function devCommand(args: Args = {}) {
  const open = args?.open ?? 'yes'
  const dataAppDir = args?.folder ? `/${args.folder}` : ''
  const appFolder = `${getDefaultCwd()}${dataAppDir}`

  const installComplete = await maybeSetupApp(appFolder)

  if (!installComplete) return

  runLatitudeServer({
    devServer: {
      open: open === 'yes',
      appFolder,
      verbose: config.debug,
    },
  })
}
