import config from '$src/config'
import path from 'path'
import spawn from '../spawn'
import { existsSync } from 'fs'
import { onError as errorFn } from '$src/utils'

const handleBadCode = () => {
  errorFn({
    message: `
🚨 Failed to install dependencies

Update latitude and try again. If this does not solve the problem,
please open an issue on GitHub:
https://gitub.com/latitude-dev/latitude/issues
      `,
  })

  process.exit(1)
}

const onError = (error: Error) => {
  errorFn({
    error,
    message: 'Error installing dependencies',
  })

  process.exit(1)
}

const installRootDependencies = () => {
  return new Promise<void>((resolve) => {
    if (!existsSync(path.join(config.rootDir, 'package.json'))) return resolve()
    if (existsSync(path.join(config.rootDir, 'node_modules'))) return resolve()

    console.log('Installing user dependencies...')

    spawn(
      'npm',
      ['install'],
      {
        cwd: config.rootDir,
        stdio: 'inherit',
      },
      {
        onError,
        onClose: (code) => {
          if (code !== 0) {
            handleBadCode()
          } else {
            resolve()
          }
        },
      },
    )
  })
}

const installAppDependencies = async () => {
  return new Promise<void>((resolve) => {
    if (existsSync(path.join(config.appDir, 'node_modules'))) return resolve()

    console.log('Installing dependencies...')

    if (config.dev) return resolve()

    spawn(
      'npm',
      ['install'],
      {
        cwd: config.appDir,
        stdio: 'inherit',
      },
      {
        onError,
        onClose: (code) => {
          if (code !== 0) {
            handleBadCode()
          } else {
            resolve()
          }
        },
      },
    )
  })
}

export default async function installDependencies() {
  await Promise.all([installRootDependencies(), installAppDependencies()])
}
