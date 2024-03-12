import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import { onError } from '../../utils'
import { spawn } from 'child_process'
import maybeSetupApp from '../shared/maybeSetupApp'
import fs from 'fs-extra'
import prepareCommand from '../prepare'
import telemetry from '../../lib/telemetry'

export default async function build(
  { docker = false }: { docker?: boolean } = { docker: false },
) {
  await telemetry.track({ event: 'buildCommand' })

  const ready = await maybeSetupApp()
  if (!ready) process.exit(1)

  const cwd = config.cwd

  await prepareCommand()

  let buildProcess

  if (docker) {
    buildProcess = spawn('docker', ['build', '.'], {
      detached: false,
      cwd,
    })
  } else {
    buildProcess = spawn(config.pkgManager.command, ['run', 'build'], {
      detached: false,
      cwd: config.appDir,
    })
  }

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

    if (!docker) {
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
    }

    console.log(colors.green(`📦 Build completed!\n`))

    if (!docker) {
      console.log(
        colors.gray(`
        To run your app, use the following commands:\n
        $ cd build
        $ node build
      `),
      )
    }

    process.exit()
  })
}
