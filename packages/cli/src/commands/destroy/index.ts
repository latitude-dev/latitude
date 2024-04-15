import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import { sseRequest } from '$src/lib/server'
import chalk from 'chalk'

async function destroyCommand() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  console.log(chalk.gray(`Destroying ${name}...`))

  const stream = await sseRequest({
    method: 'POST',
    path: '/api/apps/destroy',
    data: JSON.stringify({ app: name }),
  })

  stream.on('data', (chunk) => {
    if (chunk === null) {
      process.exit(0)
    }

    console.log(chunk.toString())
  })

  stream.on('error', (error) => {
    console.error(chalk.red('Failed to destroy:', error.message))

    process.exit(1)
  })

  stream.on('end', () => {
    console.log(chalk.green(`Destroyed ${name} successfully`))

    process.exit(0)
  })
}

export default tracked('deployCommand', loggedIn(destroyCommand))
