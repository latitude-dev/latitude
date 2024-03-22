import { CLIConfig } from '$src/config'
import setup from '$src/lib/decorators/setup'
import tracked from '$src/lib/decorators/tracked'
import sync from '$src/lib/sync'

async function prepareCommand() {
  return sync({
    config: CLIConfig.getInstance(),
  })
}

export default tracked('prepareCommand', setup(prepareCommand))
