import { exec } from 'child_process'
import { readFileSync } from 'fs'
import semverSort from 'semver/functions/rsort'
import {
  APP_FOLDER,
  DEFAULT_VERSION_LIST,
  PACKAGE_NAME,
} from '../commands/constants'
import chalk from 'chalk'

export function getInstalledVersion(appDir: string) {
  let version = null
  try {
    const packageJson = readFileSync(
      `${appDir}/${APP_FOLDER}/package.json`,
      'utf-8',
    )
    version = JSON.parse(packageJson).version
  } catch (e) {
    // Do nothing
  }

  return version
}

export default async function getLatitudeVersions({
  onFetch,
}: {
  onFetch?: () => void
} = {}) {
  const command = `npm view ${PACKAGE_NAME} versions --json`

  return new Promise<string[]>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      onFetch?.()

      if (error) reject(error)
      if (stderr) {
        console.log(chalk.yellow(stderr))
      }

      let versions: string[] | undefined = undefined
      try {
        versions = JSON.parse(stdout).filter((v: string) => !v.includes('next'))
      } catch (e) {
        reject(e)
      }

      if (!versions) return resolve(DEFAULT_VERSION_LIST)

      const sorted = semverSort(versions).slice(0, 10) // Last 10 versions
      resolve(sorted)
    })
  })
}
