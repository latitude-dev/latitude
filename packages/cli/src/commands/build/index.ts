import colors from 'picocolors'
import { CLIConfig } from '$src/config'
import path from 'path'
import { onError as error } from '$src/utils'
import fs from 'fs-extra'
import prepareCommand from '../prepare'
import spawn from '$src/lib/spawn'

export type Props = { docker?: boolean }

export default async function build(
  { docker = false }: Props = { docker: false },
) {
  await prepareCommand()
  const config = CLIConfig.getInstance()

  const handlers = {
    onClose: onClose(docker),
    onError,
    onStdout,
    onStderr,
  }

  if (docker) {
    spawn(
      'docker',
      ['build', '.'],
      {
        detached: false,
        cwd: config.source,
      },
      handlers,
    )
  } else {
    spawn(
      'npm',
      ['run', 'build'],
      {
        detached: false,
        cwd: config.appDir,
      },
      handlers,
    )
  }
}

const onClose = (docker: boolean) => async (code?: number) => {
  if (code && code !== 0) {
    console.error(colors.red(`Build failed with code: ${code}`))

    process.exit(code)
  }

  if (!docker) {
    // symlink the .latitude/app folder to a ./build folder
    // so that we can deploy the build folder
    const config = CLIConfig.getInstance()
    const targetPath = path.join(config.source, 'build')
    const appPath = path.join(config.source, '.latitude', 'app')

    try {
      const exists = await fs.pathExists(targetPath)
      if (exists) await fs.remove(targetPath)

      await fs.symlink(appPath, targetPath)
    } catch (e) {
      error({
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
}

const onError = (err: Error) => {
  error({
    error: err,
    message: `Error running build process`,
  })
}

const onStdout = (data: Buffer) => {
  console.log(colors.gray(data.toString()))
}

const onStderr = (data: Buffer) => {
  if (data.includes('WARNING')) return // ignore warnings

  console.error(colors.yellow(data.toString()))
}
