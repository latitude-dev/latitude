import colors from 'picocolors'
import telemetry from '$src/lib/telemetry'
import { CommonCLIArgs } from '$src/types'

type Args = CommonCLIArgs & {
  enable?: boolean
  disable?: boolean
  status?: unknown
}
export default function telemetryCommand(args: Args = {}): void {
  const enable = args?.enable ?? false
  const disable = args?.disable ?? false
  const showStatus = args?.status !== undefined

  if (enable) {
    telemetry.enabled = true
    console.log(colors.blue('Telemetry enabled'))
  } else if (disable) {
    telemetry.enabled = false
    console.log(colors.blue('Telemetry disabled'))
  } else if (showStatus) {
    console.log(
      colors.blue(
        `Telemetry is ${
          telemetry.enabled ? colors.green('enabled') : colors.red('disabled')
        }`,
      ),
    )
  } else {
    console.log(
      colors.red(
        'No valid option provided. Check with latitude telemetry --help',
      ),
    )
  }
}
