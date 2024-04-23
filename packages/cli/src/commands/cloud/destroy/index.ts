import chalk from 'chalk'
import counter from '$src/lib/counter'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import ora from 'ora'
import tracked from '$src/lib/decorators/tracked'
import { sseRequest } from '$src/lib/server'

async function destroyCommand() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  const spinner = ora(`Destroying ${name}...`).start()

  try {
    const clock = counter()
    const res = await sseRequest({
      method: 'POST',
      path: '/api/apps/destroy',
      data: JSON.stringify({ app: name }),
    })

    res.on('data', (chunk) => {
      clock.end()

      const payload = JSON.parse(chunk.toString())
      if (payload.error) {
        spinner.stop()

        console.log(chalk.red('Failed to deploy: ', payload.message))

        process.exit(1)
      }

      clock.tick((diff) => {
        const mm = String(diff.getUTCMinutes()).padStart(2, '0')
        const ss = String(diff.getUTCSeconds()).padStart(2, '0')

        spinner.text = payload.message + ' ' + `${mm}:${ss}`
      })

      clock.start()
    })

    res.on('error', (error) => {
      console.error(chalk.red('Failed to destroy:', error.message))

      process.exit(1)
    })

    res.on('end', () => {
      spinner.stop()

      if (res.statusCode !== 200) {
        console.error(chalk.red('Failed to destroy:', res.statusMessage))

        process.exit(1)
      } else {
        console.log(chalk.green('Destroyed:', name))

        process.exit(0)
      }
    })
  } catch (e) {
    console.error(chalk.red('Failed to destroy:', (e as Error).message))

    process.exit(1)
  }
}

export default tracked('destroyCommand', destroyCommand)
