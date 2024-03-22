import { CLIConfig } from '$src/config'
import fsExtra from 'fs-extra'
import path from 'path'
import setupApp from '../setupApp'
import { LATITUDE_FOLDER } from '$src/commands/constants'

export default async function maybeSetupApp(config: CLIConfig = CLIConfig.getInstance()) {
  const hasApp = fsExtra.existsSync(path.join(config.source, LATITUDE_FOLDER))

  if (hasApp) return true

  return setupApp({ version: config.projectConfig.version })
}
