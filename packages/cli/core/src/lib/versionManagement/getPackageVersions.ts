import { exec } from 'child_process'
import semverSort from 'semver/functions/rsort'
import chalk from 'chalk'

// Backwards Compatibility. before we called canary versions "next"
const CANARY_VERSION = ['canary', 'next']

function isCanary(version: string) {
  return CANARY_VERSION.some((v) => version.includes(v))
}
export default async function getPackageVersions({
  packageName,
  onFetch,
  canary = false,
  defaultVersionList = ['latest'],
}: {
  packageName: string
  onFetch?: () => void
  canary?: boolean
  defaultVersionList?: string[]
}) {
  const command = `npm view ${packageName} versions --json`

  return new Promise<string[]>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      onFetch?.()

      if (error) reject(error)
      if (stderr) {
        console.log(chalk.yellow(stderr))
      }

      let versions: string[] | undefined = undefined
      try {
        versions = JSON.parse(stdout)
        versions = canary
          ? versions
          : versions?.filter((v: string) => !isCanary(v))
      } catch (e) {
        reject(e)
      }

      if (!versions) {
        if (defaultVersionList) return resolve(defaultVersionList)
        reject('No versions found')
      }

      const sorted = semverSort(versions!).slice(0, 10) // Last 10 versions
      resolve(sorted)
    })
  })
}
