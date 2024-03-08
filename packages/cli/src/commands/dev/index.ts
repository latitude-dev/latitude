import config from '../../config'
import runLatitudeServer from './runLatitudeServer'
import { CommonCLIArgs } from '../../types'
import maybeSetupApp from '../shared/maybeSetupApp'
import InstalledVersionChecker from '../../lib/latitudeConfig/InstalledVersionChecker'
import { DevServerProps } from './runDev'

type Args = CommonCLIArgs & { open?: string }
export default async function devCommand(args: Args = {}) {
  const open = args?.open ?? 'yes'

  const checker = new InstalledVersionChecker(
    config.cwd,
    config.projectConfig.appVersion,
  )

  const ready = await maybeSetupApp()
  if (!ready) process.exit(1)

  let server: DevServerProps = {
    open: open === 'yes',
    appFolder: config.cwd,
    verbose: config.debug,
  }

  server = checker.isDifferent()
    ? {
        ...server,
        onReady: () => {
          checker.displayMessage()
        },
      }
    : server

  runLatitudeServer({ server })
}
