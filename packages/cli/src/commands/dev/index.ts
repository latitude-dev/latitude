import InstalledVersionChecker from '$src/lib/latitudeConfig/InstalledVersionChecker'
import config from '$src/config'
import sync from '$src/lib/sync'
import { CommonCLIArgs } from '$src/types'
import { DevServerProps, runDevServer } from './runDev'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'

export type Props = CommonCLIArgs & { open?: string; port?: number }

export default async function devCommand(args: Props = {}) {
  await sync({
    watch: true,
  })

  runDevServer(
    await buildServerProps({ open: args?.open ?? 'yes', port: args.port }),
  )
}

const buildServerProps = async ({
  open,
  port,
}: {
  open: string
  port?: number
}) => {
  const server: DevServerProps = {
    open: open === 'yes',
    port: port,
    appFolder: config.rootDir,
    verbose: config.verbose,
  }
  const latitudeJson = await findOrCreateConfigFile()

  const checker = new InstalledVersionChecker(
    config.rootDir,
    // TODO: Fix this. Version should never be undefined in reality.
    latitudeJson.data.version as string,
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
