import config from '../../config'
import runLatitudeServer, { getDefaultCwd } from './runLatitudeServer'

type DevArgs = { open?: 'yes' | 'no'; folder?: string }
export default async function devCommand(args: DevArgs = {}) {
  const open = args?.open ?? 'yes'
  const dataAppDir = args?.folder ? `/${args.folder}` : ''
  const appFolder = `${getDefaultCwd()}${dataAppDir}`
  runLatitudeServer({
    devServer: {
      open: open === 'yes',
      appFolder,
      verbose: config.debug,
    },
  })
}
