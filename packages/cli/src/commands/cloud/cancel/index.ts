import chalk from 'chalk'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import ora from 'ora'
import tracked from '$src/lib/decorators/tracked'
import { request } from '$src/lib/server'

async function cancel() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  const spinner = ora(`Cancelling deploy of ${name}...`).start()

  await request({
    method: 'POST',
    path: '/api/apps/cancel',
    data: JSON.stringify({ app: name }),
  }).catch((err) => {
    spinner.stop()

    console.error(chalk.red('Failed to cancel deploy:', err.message))

    process.exit(1)
  })

  spinner.stop()

  console.log(chalk.green('Deploy cancelled.'))
}

export default tracked('cancelCommand', cancel)
