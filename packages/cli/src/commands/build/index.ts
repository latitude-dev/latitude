import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import syncQueries from '../shared/syncQueries'
import syncViews from '../shared/syncViews'
import { APP_FOLDER } from '../constants'
import { onError } from '../../utils'
import { spawn } from 'child_process'
import maybeSetupApp from '../shared/maybeSetupApp'
import fs from 'fs-extra'

export default async function build() {
  const ready = await maybeSetupApp()
  if (!ready) process.exit(1)

  const cwd = config.cwd
  const appName = path.basename(cwd)

  await syncViews({ dataAppDir: cwd, appName })
  await syncQueries({ rootDir: cwd })

  const buildCwd = path.join(cwd, APP_FOLDER)
  const buildProcess = spawn(config.pkgManager.command, ['run', 'build'], {
    detached: false,
    cwd: buildCwd,
  })

  buildProcess.stdout?.on('data', (data) => {
    console.log(colors.gray(data))
  })

  buildProcess.stderr?.on('data', (data) => {
    if (data.includes('WARNING')) return // ignore warnings

    console.error(colors.yellow(data))
  })

  buildProcess.on('error', (err) => {
    onError({
      error: err,
      message: `Error running build process`,
    })
  })

  buildProcess.on('close', async (code) => {
    if (code && code !== 0) {
      console.error(colors.red(`Build failed with code ${code}`))
      process.exit(code)
    }

    // symlink the .latitude/app folder to a ./build folder
    // so that we can deploy the build folder
    const targetPath = path.join(cwd, 'build')
    const appPath = path.join(cwd, '.latitude', 'app')

    try {
      const exists = await fs.pathExists(targetPath)
      if (exists) await fs.remove(targetPath)

      await fs.symlink(appPath, targetPath)
    } catch (e) {
      console.log('error: ', e)
      onError({
        error: e as Error,
        message: 'Error creating symlink to build folder',
      })
    }

    console.log(colors.green(`📦 Build completed!\n`))
    console.log(
      colors.gray(`
      To run your app, use the following commands:\n
      $ cd build 
      $ node build
    `),
    )

    process.exit()
  })
}
