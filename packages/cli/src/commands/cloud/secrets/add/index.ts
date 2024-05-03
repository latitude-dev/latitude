import chalk from 'chalk'
import ora from 'ora'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import tracked from '$src/lib/decorators/tracked'
import { ApiError, request } from '$src/lib/server'
import { CommonCLIArgs } from '$src/types'

type Props = CommonCLIArgs & { _: string[] }
async function addSecret({ _ }: Props) {
  const latitudeJson = findConfigFile()
  const app = latitudeJson.data.name!
  const secret = _[0]
  const spinner = ora('Adding secret...').start()
  try {
    await request({
      method: 'POST',
      path: '/api/secrets/add',
      data: JSON.stringify({ app, secret }),
    })
  } catch (err) {
    const error = err as ApiError
    spinner.stop()
    error.displayErrorDetails({ message: 'Failed to add secret' })
    process.exit(1)
  }

  spinner.stop()
  console.log(chalk.green('Secret added 🤫.'))
}

export default tracked('addSecretCommand', addSecret)
