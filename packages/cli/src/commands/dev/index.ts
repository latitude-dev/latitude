import config from '../../config'
import runLatitudeServer from './runLatitudeServer'
import { CommonCLIArgs } from '../../types'
import maybeSetupApp from '../shared/maybeSetupApp'

type Args = CommonCLIArgs & { open?: string }
export default async function devCommand(args: Args = {}) {
  const open = args?.open ?? 'yes'

  const ready = await maybeSetupApp()
  if (!ready) process.exit(1)

  runLatitudeServer({
    server: {
      open: open === 'yes',
      appFolder: config.cwd,
      verbose: config.debug,
    },
  })
}
