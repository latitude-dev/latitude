import chalk from 'chalk'
import { onError as errorFn } from '$src/utils'
import config from '$src/config'
import { existsSync } from 'fs'
import path from 'path'
import npmUpdate from '../npm/update'
import npmInstall from '../npm/install'

const handleBadCode = () => {
  console.log(chalk.red('Failed to install dependencies'))

  process.exit(1)
}

const onError = (error: Error) => {
  errorFn({
    error,
    message: 'Error installing dependencies',
  })

  process.exit(1)
}

const onClose =
  (resolve: (value: void | PromiseLike<void>) => void) => (code: number) => {
    if (code !== 0) {
      handleBadCode()
    } else {
      resolve()
    }
  }

export const handlers = (
  resolve: (value: void | PromiseLike<void>) => void,
) => {
  return {
    onError,
    onClose: onClose(resolve),
  }
}

export async function manageDependencies({
  root,
  isUpdate = false,
}: {
  root: boolean
  isUpdate?: boolean
}) {
  return new Promise<void>((resolve) => {
    const cwd = root ? config.rootDir : config.appDir
    const packageExists = existsSync(path.join(cwd, 'package.json'))
    if (!packageExists) return resolve()

    const nodeModulesExist = existsSync(path.join(cwd, 'node_modules'))
    if (nodeModulesExist && !isUpdate) return resolve()

    const shouldUpdate = isUpdate && nodeModulesExist

    if (root) {
      console.log(
        shouldUpdate
          ? 'Root dependencies already installed. Running update instead...'
          : 'Installing user dependencies...',
      )
    } else {
      console.log(
        shouldUpdate
          ? 'App dependencies already installed. Running update instead...'
          : 'Installing app dependencies...',
      )
    }

    // Based on whether it's an update or install
    const operation = shouldUpdate ? npmUpdate : npmInstall
    return operation({
      cwd: cwd,
      handlers: handlers(resolve),
    })
  })
}
