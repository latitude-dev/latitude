import config from '../../../config'
import fsExtra from 'fs-extra'
import path from 'path'
import setupApp from '../../../lib/setupApp'
import { LATITUDE_FOLDER } from '../../constants'

export default async function maybeSetupApp() {
  const hasApp = fsExtra.existsSync(path.join(config.cwd, LATITUDE_FOLDER))

  if (hasApp) return true

  return setupApp({ appVersion: config.projectConfig.appVersion })
}
