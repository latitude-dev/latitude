import chalk from 'chalk'
import findConfigFile from '$src/lib/latitudeConfig/findConfigFile'
import loggedIn from '$src/lib/decorators/loggedIn'
import tracked from '$src/lib/decorators/tracked'
import { request, sseRequest } from '$src/lib/server'
import { spawn } from 'child_process'
import ora from 'ora'

function buildDockerImage(tag: string) {
  return new Promise<string>((resolve, reject) => {
    const build = spawn(
      'docker',
      ['build', '--platform', 'linux/amd64', '-t', tag, '.', '--load'],
      {
        stdio: 'inherit',
      },
    )

    build.on('exit', (code) => {
      if (code === 0) {
        resolve(tag)
      } else {
        reject(new Error(`build process exited with code ${code}`))
      }
    })
  })
}

async function pushDockerImage({
  username,
  password,
  url,
  tag,
}: {
  username: string
  password: string
  url: string
  tag: string
}) {
  return new Promise<void>((resolve, reject) => {
    const login = spawn('docker', [
      'login',
      '--username',
      username,
      '--password-stdin',
      url,
    ])

    login.stdin.write(password)
    login.stdin.end()

    login.on('exit', (code) => {
      if (code === 0) {
        const push = spawn('docker', ['push', tag], { stdio: 'inherit' })

        push.on('exit', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`push process exited with code ${code}`))
          }
        })
      } else {
        reject(new Error('docker login failed'))
      }
    })
  })
}

async function deployCommand() {
  const latitudeJson = findConfigFile()
  const name = latitudeJson.data.name

  const spinner = ora(`Deploying ${name}...`).start()

  request(
    {
      method: 'POST',
      path: '/api/ecr/repositories/find-or-create',
      data: JSON.stringify({ name }),
    },
    async ({ err, res }) => {
      if (err) {
        console.error(
          chalk.red('Failed to get registry credentials:', err.message),
        )
        process.exit(1)
      } else {
        const { response, responseBody } = res

        if (response.statusCode === 200) {
          const { url } = JSON.parse(responseBody)
          const tag = `${url}:latest`

          request({ path: '/api/ecr/credentials' }, async ({ err, res }) => {
            if (err) {
              console.error(
                chalk.red('Failed to get registry credentials:', err.message),
              )
              process.exit(1)
            } else {
              const { response, responseBody } = res
              if (response.statusCode === 200) {
                const { username, password } = JSON.parse(responseBody)

                try {
                  await buildDockerImage(tag)
                  await pushDockerImage({ username, password, tag, url })

                  const stream = await sseRequest({
                    method: 'POST',
                    path: '/api/apps/deploy',
                    data: JSON.stringify({ app: name }),
                  })

                  stream.on('data', (chunk) => {
                    if (chunk === null) process.exit(0)

                    spinner.text = chunk.toString()
                  })

                  stream.on('error', (error) => {
                    console.error(chalk.red('Failed to deploy:', error.message))

                    process.exit(1)
                  })

                  stream.on('end', () => {
                    spinner.stop()

                    console.log(chalk.green('Deployed successfully!'))

                    process.exit(0)
                  })
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
    },
  )
}

export default tracked('deployCommand', loggedIn(deployCommand))
