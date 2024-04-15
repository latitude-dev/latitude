import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import { sseRequest } from '$src/lib/server'
import chalk from 'chalk'
import ora from 'ora'

async function destroyCommand() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  const spinner = ora(`Destroying ${name}...`).start()

  try {
    const stream = await sseRequest({
      method: 'POST',
      path: '/api/apps/destroy',
      data: JSON.stringify({ app: name }),
    })

    stream.on('data', (chunk) => {
      if (chunk === null) process.exit(0)

      spinner.text = chunk.toString()
    })

    stream.on('error', (error) => {
      console.error(chalk.red('Failed to destroy:', error.message))

      process.exit(1)
    })

    stream.on('end', () => {
      spinner.stop()

      console.log(chalk.green(`Destroyed ${name} successfully`))

      process.exit(0)
    })
  } catch (e) {
    console.error(chalk.red('Failed to destroy:', (e as Error).message))

    process.exit(1)
  }
}

export default tracked('deployCommand', loggedIn(destroyCommand))
