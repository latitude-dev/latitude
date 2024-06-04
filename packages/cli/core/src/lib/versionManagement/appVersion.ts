import { readFileSync } from 'fs'
import { DEFAULT_VERSION_LIST, PACKAGE_NAME } from '../../commands/constants'
import getPackageVersions from './getPackageVersions'

export function getInstalledVersion(appDir: string): string | null {
  try {
    const packageJson = readFileSync(`${appDir}/package.json`, 'utf-8')
    return JSON.parse(packageJson).version
  } catch (e) {
    // Do nothing
  }

  return null
}

export async function getAvailableVersions({
  onFetch,
  canary = false,
}: {
  onFetch?: () => void
  canary?: boolean
} = {}) {
  return getPackageVersions({
    packageName: PACKAGE_NAME,
    onFetch,
    canary,
    defaultVersionList: DEFAULT_VERSION_LIST,
  })
}
