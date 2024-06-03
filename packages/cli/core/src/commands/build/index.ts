import colors from 'picocolors'
import config from '$src/config'
import path from 'path'
import { onError as error } from '$src/utils'
import fs from 'fs-extra'
import spawn from '$src/lib/spawn'
import tracked from '$src/lib/decorators/tracked'
import setup from '$src/lib/decorators/setup'
import sync from '$src/lib/sync'
import setRootDir from '$src/lib/decorators/setRootDir'

async function build() {
  await sync()

  const handlers = {
    onClose,
    onError,
  }

  spawn(
    'npm',
    ['run', 'build'],
    {
      detached: false,
      cwd: config.appDir,
      stdio: 'inherit',
    },
    handlers,
  )
}

const onClose = async (code?: number) => {
  if (code && code !== 0) {
    console.error(colors.red(`Build failed with code: ${code}`))

    process.exit(code)
  }

  // symlink the .latitude/app folder to a ./build folder
  // so that we can deploy the build folder
  const targetPath = path.join(config.rootDir, 'build')
  const appPath = path.join(config.rootDir, '.latitude', 'app')

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

  console.log(colors.green(`📦 Build completed!\n`))

  console.log(`
To run your app, use the following commands:\n
$ cd build
$ node build
`)

  process.exit()
}

const onError = (err: Error) => {
  error({
    error: err,
    message: `Error running build process`,
  })
}

export default tracked('buildCommand', setRootDir(setup(build)))
