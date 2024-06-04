import config from '$src/config'
import { CONNECTOR_PACKAGES } from '@latitude-data/source-manager'
import { readFileSync } from 'fs'
import spawn from '../spawn'
import { PACKAGE_ORG } from '$src/commands/constants'
import getPackageVersions from './getPackageVersions'

type ConnectorDependencies = {
  dependencies: string[]
  devDependencies: string[]
}

export function getInstalledConnectors(): ConnectorDependencies {
  const connectorPackages = Object.values(CONNECTOR_PACKAGES).map(
    (packageName) => `${PACKAGE_ORG}/${packageName}`,
  )
  try {
    const packageJson = readFileSync(`${config.rootDir}/package.json`, 'utf-8')
    const { dependencies, devDependencies } = JSON.parse(packageJson)
    const installedConnectors = {
      dependencies: Object.keys(dependencies ?? {}).filter((key) =>
        connectorPackages.includes(key),
      ),
      devDependencies: Object.keys(devDependencies ?? {}).filter((key) =>
        connectorPackages.includes(key),
      ),
    }
    return installedConnectors
  } catch (e) {
    throw new Error(
      `Failed to read and parse package.json file at ${config.rootDir}/package.json`,
    )
  }
}

function updatePackage({
  packageName,
  dev,
  canary,
}: {
  packageName: string
  dev: boolean
  canary: boolean
}) {
  return new Promise<void>((resolve, reject) => {
    getPackageVersions({ packageName, canary }).then((connectorVersions) => {
      const latestVersion = connectorVersions[0]
      const command = `install ${
        dev ? '-D' : ''
      } ${packageName}@${latestVersion}`
      spawn(
        'npm',
        command.split(' ').filter(Boolean),
        {},
        {
          onClose: () => resolve(),
          onError: (error) => reject(error),
          onStdout: (message: Buffer) => {
            if (config.verbose) console.log(message.toString())
          },
        },
      )
    })
  })
}

export default async function updateConnectors({
  canary = false,
}: {
  canary: boolean
}): Promise<void> {
  const installedConnectors = getInstalledConnectors()
  for (const packageName of installedConnectors.dependencies) {
    await updatePackage({ packageName, dev: false, canary })
  }
  for (const packageName of installedConnectors.devDependencies) {
    await updatePackage({ packageName, dev: true, canary })
  }
}
