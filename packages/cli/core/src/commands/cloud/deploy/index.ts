import buildDockerImage from './docker/build'
import chalk from 'chalk'
import counter from '$src/lib/counter'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import ora from 'ora'
import pushDockerImage from './docker/push'
import tracked from '$src/lib/decorators/tracked'
import { ApiError, request, sseRequest } from '$src/lib/server'
import { GITHUB_STARTS_BANNER } from '$src/commands/constants'

function deployedMessage(url: string) {
  console.log(
    chalk.white(`
    ${chalk.green('Deployed successfully!')}

    Check your application at:
    ${chalk.blue(url)}

    ${GITHUB_STARTS_BANNER}
`),
  )
}
async function deploy({ app, digest }: { app: string; digest: string }) {
  const spinner = ora(`Deploying ${app}...`).start()
  const stream = await sseRequest({
    method: 'POST',
    path: '/api/apps/deploy',
    data: JSON.stringify({ app, digest }),
  })

  let output: string

  const clock = counter()
  stream.on('data', (chunk) => {
    clock.end()

    const payload = JSON.parse(chunk.toString())
    if (payload.error) {
      spinner.stop()

      console.log(chalk.red('Failed to deploy: ', payload.message))

      process.exit(1)
    }

    if (payload.done) {
      output = payload.message
    } else {
      clock.tick((diff) => {
        const mm = String(diff.getUTCMinutes()).padStart(2, '0')
        const ss = String(diff.getUTCSeconds()).padStart(2, '0')

        spinner.text = payload.message + ' ' + `${mm}:${ss}`
      })

      clock.start()
    }
  })

  stream.on('error', (error) => {
    console.error(chalk.red('Failed to deploy:', error.message))

    process.exit(1)
  })

  stream.on('end', () => {
    spinner.stop()

    deployedMessage(output)

    process.exit(0)
  })
}

async function deployCommand(
  { force = false, nocache = false }: { force?: boolean; nocache?: boolean } = {
    force: false,
    nocache: false,
  },
) {
  const latitudeJson = findConfigFile()
  const app = latitudeJson.data.name!

  console.log(`Deploying ${app}...`)

  const { url, latestImage } = await request({
    method: 'POST',
    path: '/api/ecr/repositories/find-or-create',
    data: JSON.stringify({ app }),
  })
    .then(({ body }) => JSON.parse(body))
    .catch((err) => {
      if ((err as ApiError).status === 401) {
        console.error(
          chalk.yellow(`
You are not logged in. Please run the following command to sign up:

    ${chalk.cyan('latitude signup')}

If you have already signed up, please run the following command to log in:

    ${chalk.cyan('latitude login')}
`),
        )
      } else {
        console.error(chalk.red('Failed to get/create registry:', err.message))
      }

      process.exit(1)
    })

  const tags = [`${url}:latest`] as [string]
  const { username, password } = await request({ path: '/api/ecr/credentials' })
    .then(({ body }) => JSON.parse(body))
    .catch((err) => {
      console.error(
        chalk.red('Failed to get registry credentials:', err.message),
      )

      process.exit(1)
    })

  try {
    await buildDockerImage({ tags, noCache: nocache })
    const digest = await pushDockerImage({
      username,
      password,
      url,
      tags,
    })

    if (digest === latestImage?.imageDigest && !force) {
      console.log(
        chalk.yellow(`
No changes detected, skipping deployment. To force a new deployment, run:

 ${chalk.green('latitude deploy --force')}
`),
      )

      process.exit(0)
    }

    deploy({ app, digest })
  } catch (error) {
    console.error(chalk.red('Failed to deploy:', (error as Error).message))

    process.exit(1)
  }
}

export default tracked('deployCommand', deployCommand)
