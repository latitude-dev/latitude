import InstalledVersionChecker from '$src/lib/latitudeConfig/InstalledVersionChecker'
import config from '$src/config'
import sync from '$src/lib/sync'
import { CommonCLIArgs } from '$src/types'
import { DevServerProps, runDevServer } from './runDev'

export type Props = CommonCLIArgs & { open?: string; port?: number }

export default async function devCommand(args: Props = {}) {
  await sync({ watch: true })

  runDevServer(buildServerProps({ open: args?.open ?? 'yes', port: args.port }))
}

const buildServerProps = ({ open, port }: { open: string; port?: number }) => {
  const server: DevServerProps = {
    open: open === 'yes',
    port: port,
    appFolder: config.cwd,
    verbose: config.debug,
  }

  const checker = new InstalledVersionChecker(
    config.cwd,
    config.projectConfig.version,
  )

  return checker.isDifferent()
    ? {
        ...server,
        onReady: () => {
          checker.displayMessage()
        },
      }
    : server
}
