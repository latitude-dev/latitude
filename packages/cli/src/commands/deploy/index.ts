import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import { request } from '$src/lib/server'
import betterSpawn from '$src/lib/spawn'
import chalk from 'chalk'
import { spawnSync } from 'child_process'

async function loginDockerRegistry({ url, password }) {
  // TODO
}

async function buildDockerImage() {
  return new Promise((resolve, reject) => {
    betterSpawn(
      'docker',
      ['build', '.'],
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

async function pushDockerImage({ url, image }) {
  // TODO
}

function deployCommand() {
  console.log('Deploying...')

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

          await loginDockerRegistry({ url, password })
          const image = await buildDockerImage()
          console.log('image: ', image)

          await pushDockerImage({ url, image })

          console.log(chalk.green('Deployed successfully!'))
        } catch (error) {
          console.error('Failed to parse response:', (error as Error).message)
        }
      } else {
        try {
          const response = JSON.parse(responseBody)
          console.error(chalk.red('ERROR: ', response.error))
        } catch (error) {
          console.error(responseBody)
        }
      }
    }
  })
}

export default tracked('deployCommand', loggedIn(deployCommand))
