import { CLIConfig } from '$src/config'
import setupApp from '$src/lib/setupApp'

export default function setup(commandFn: Function) {
  return async function (...args: any[]) {
    const config = CLIConfig.getInstance()

    await setupApp({ version: config.projectConfig.version })

    return commandFn(...args)
  }
}
