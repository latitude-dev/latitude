import { CLI_PACKAGE_NAME } from '../../commands/constants'
import getPackageVersions from './getPackageVersions'
import { exec } from 'child_process'
import chalk from 'chalk'

export async function getInstalledVersion() {
  const command = `npm list -g ${CLI_PACKAGE_NAME} --depth=0 --json`

  return new Promise<string | null>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)

      if (stderr) {
        // NOTE: NPM can output warnings to stderr, so we don't want to exit
        // the process, just inform the user.
        console.log(chalk.yellow(stderr))
      }

      const packages = JSON.parse(stdout)
      const version = packages['dependencies'][CLI_PACKAGE_NAME]?.version as
        | string
        | undefined

      resolve(version ?? null)
    })
  })
}

export async function getAvailableVersions({
  onFetch,
  canary = false,
}: {
  onFetch?: () => void
  canary?: boolean
}) {
  return getPackageVersions({
    packageName: CLI_PACKAGE_NAME,
    onFetch,
    canary,
  })
}
