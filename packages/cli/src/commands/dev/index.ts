import config from '../../config'
import fsExtra from 'fs-extra'
import path from 'path'
import runLatitudeServer from './runLatitudeServer'
import setupApp from '../../lib/setupApp'
import { CommonCLIArgs } from '../../types'
import { LATITUDE_FOLDER } from '../constants'
import { onError } from '../../utils'

async function maybeSetupApp() {
  const hasApp = fsExtra.existsSync(path.join(config.cwd, LATITUDE_FOLDER))

  if (hasApp) return true

  return setupApp({ onError })
}

type Args = CommonCLIArgs & { open?: string }
export default async function devCommand(args: Args = {}) {
  const open = args?.open ?? 'yes'

  const installComplete = await maybeSetupApp()

  if (!installComplete) return

  runLatitudeServer({
    server: {
      open: open === 'yes',
      appFolder: config.cwd,
      verbose: config.debug,
    },
  })
}
