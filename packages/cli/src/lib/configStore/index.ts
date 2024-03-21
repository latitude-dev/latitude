import Configstore from 'configstore'
import { CLI_PACKAGE_NAME } from '$src/commands/constants'

const TELEMETRY_NOT_CONFIGURED = {
  enabled: undefined,
  anonymousUserId: undefined,
}

export default new Configstore(CLI_PACKAGE_NAME, {
  telemetry: TELEMETRY_NOT_CONFIGURED,
  lastCheckedAt: undefined,
})
