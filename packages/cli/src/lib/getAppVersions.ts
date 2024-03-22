import { exec } from 'child_process'
import { readFileSync } from 'fs'
import semverSort from 'semver/functions/rsort'
import {
  LATITUDE_SERVER_FOLDER,
  DEFAULT_VERSION_LIST,
  LATITUDE_SERVER_PACKAGE_NAME,
} from '../commands/constants'
import { type PackageManagerWithFlags } from '../config'

export function getInstalledVersion(appDir: string) {
  let version = null
  try {
    const packageJson = readFileSync(`${appDir}/${LATITUDE_SERVER_FOLDER}/package.json`, 'utf-8')
     version = JSON.parse(packageJson).version
  } catch (e) {
    // Do nothing
  }
  return version
}

export async function getLatitudeVersions({
  pkgManager,
  onFetch,
}: {
  pkgManager: PackageManagerWithFlags
  onFetch?: () => void
}) {
  const command = `${pkgManager.command} view ${LATITUDE_SERVER_PACKAGE_NAME} versions --json`
  return new Promise<string[]>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      onFetch?.()

      if (error) {
        reject(error)
      }

      if (stderr) {
        reject(stderr)
      }

      let versions: string[] | undefined = undefined
      try {
        versions = JSON.parse(stdout)
      } catch (e) {
        reject(e)
      }

      const loose = false // Don't include pre-release versions
      if (!versions) return resolve(DEFAULT_VERSION_LIST)

      const sorted = semverSort(versions, loose).slice(0, 10) // Last 10 versions
      resolve(sorted)
    })
  })
}
