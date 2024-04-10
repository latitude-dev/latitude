import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'
import { request } from '$src/lib/server'
import betterSpawn from '$src/lib/spawn'
import chalk from 'chalk'
import { spawnSync } from 'child_process'

async function loginDockerRegistry({ url, password }) {
  return new Promise<void>((resolve, reject) => {
    betterSpawn(
      'docker',
      ['login', url, '--password-stdin'],
      { stdio: 'pipe' },
      {
        onClose: (code) => {
          if (code !== 0) {
            console.error(chalk.red('Failed to login to Docker registry'))
            reject()
          }

          resolve()
        },
        onStdout: (child) => {
          child.stdin.write(`${password}\n`)
        },
      },
    )
  })
}

async function buildDockerImage(tag) {
  return new Promise((resolve, reject) => {
    betterSpawn(
      'docker',
      ['build', '.', '-t', tag],
      { stdio: 'inherit' },
      {
        onClose: (code) => {
          if (code !== 0) {
            console.error(chalk.red('Failed to build Docker image'))
            reject()
          }

          const image = spawnSync('docker', ['images', '-q', 'latest'])
            .stdout.toString()
            .trim()

          resolve(image)
        },
      },
    )
  })
}

async function pushDockerImage(tag) {
  return new Promise<void>((resolve, reject) => {
    betterSpawn(
      'docker',
      ['push', tag],
      { stdio: 'inherit' },
      {
        onClose: (code) => {
          if (code !== 0) {
            console.error(chalk.red('Failed to push Docker image'))
            reject()
          }

          resolve()
        },
      },
    )
  })
}

async function deployCommand() {
  console.log('Deploying...')

  const latitudeJson = await findOrCreateConfigFile()
  const name = latitudeJson.data.name

  request({ path: '/api/registry-credentials' }, async ({ err, res }) => {
    if (err) {
      console.error(
        chalk.red('Failed to get registry credentials:', err.message),
      )
      process.exit(1)
    } else {
      const { response, responseBody } = res

      if (response.statusCode === 200) {
        try {
          const { url, password } = JSON.parse(responseBody)
          const tag = `${url}/${name}:latest`

          await loginDockerRegistry({ url, password })
          await buildDockerImage(tag)
          await pushDockerImage(tag)

          console.log(chalk.green('Deployed successfully!'))
        } catch (error) {
          console.error(
            chalk.red('Failed to deploy:', (error as Error).message),
          )

          process.exit(1)
        }
      } else {
        try {
          const response = JSON.parse(responseBody)
          console.error(chalk.red('Failed to deploy: ', response.error))
        } catch (error) {
          console.error(responseBody)
        } finally {
          process.exit(1)
        }
      }
    }
  })
}

export default tracked('deployCommand', loggedIn(deployCommand))
