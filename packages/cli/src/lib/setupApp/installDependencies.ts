import colors from 'picocolors'
import config from '$src/config'
import path from 'path'
import spawn from '../spawn'
import { existsSync } from 'fs'
import { onError } from '$src/utils'

export default async function installAppDependencies() {
  if (!config.pro) return
  if (existsSync(path.join(config.appDir, 'node_modules'))) return

  return new Promise((resolve) => {
    spawn(
      'npm',
      ['install'],
      {
        cwd: config.appDir,
        stdio: 'inherit',
      },
      {
        onError: (error) => {
          onError({
            error: error as Error,
            message: 'Error installing dependencies',
          })

          process.exit(1)
        },
        onClose: (code) => {
          if (code !== 0) {
            onError({
              message: `
🚨 Failed to install dependencies

Update latitude and try again. If this does not solve the problem,
please open an issue on GitHub:
https://gitub.com/latitude-dev/latitude/issues
      `,
            })

            process.exit(1)
          } else {
            console.log(colors.green('Dependencies installed successfully 🎉'))
            resolve(true)
          }
        },
      },
    )
  })
}
