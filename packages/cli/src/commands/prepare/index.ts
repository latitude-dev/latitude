import { CLIConfig } from '$src/config'
import sync from '$src/lib/sync'

export default async function prepareCommand() {
  return sync({
    config: CLIConfig.getInstance(),
  })
}
