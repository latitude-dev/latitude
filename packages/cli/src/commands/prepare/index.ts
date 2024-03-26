import setup from '$src/lib/decorators/setup'
import tracked from '$src/lib/decorators/tracked'
import sync from '$src/lib/sync'
import chalk from 'chalk'

// TODO: Remove this command in the next major release.
async function prepareCommand() {
  console.log(
    chalk.yellow(
      'DEPRECATED: This command is deprecated and will be removed in the next major release.',
    ),
  )
  return sync()
}

export default tracked('prepareCommand', setup(prepareCommand))
