import sync from '../../lib/sync'
import telemetry from '../../lib/telemetry'

export default async function prepareCommand() {
  await telemetry.track({ event: 'prepareCommand' })
  return sync()
}
