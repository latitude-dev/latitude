import fs from 'fs'
import spawn from '$src/lib/spawn'
import colors from 'picocolors'
import { onError } from '$src/utils'
import {
  getConnectorPackage,
  loadConfig,
} from '@latitude-data/connector-factory'
import { APP_FOLDER } from '$src/commands/constants'

function installErrorMessage({ npmPackage }: { npmPackage: string }) {
  return `
🚨 Failed to install connector ${npmPackage}

To install manually the connector run:
'npm init -y && npm install ${npmPackage}' in the app directory.
`
}

function installConnector({
  rootDir,
  npmPackage,
  npmVersion,
}: {
  rootDir: string
  npmPackage: string
  npmVersion: string
}) {
  const errorMessage = installErrorMessage({ npmPackage })
  return new Promise((resolve) => {
    spawn(
      'npm',
      ['install', `${npmPackage}@${npmVersion}`],
      {
        cwd: rootDir,
        stdio: 'inherit',
      },
      {
        onError: (error) => {
          onError({
            error: error as Error,
            message: errorMessage,
          })

          process.exit(1)
        },
        onClose: (code) => {
          if (code !== 0) {
            onError({ message: errorMessage })
            process.exit(1)
          } else {
            const env = process.env.NODE_ENV
            if (env !== 'test') {
              console.log(
                colors.green(
                  `Connector ${npmPackage} installed successfully 🎉`,
                ),
              )
            }

            resolve(true)
          }
        },
      },
    )
  })
}

async function maybeInitPackageJson({
  rootDir,
  npmPackage,
}: {
  rootDir: string
  npmPackage: string
}) {
  const pkgPath = `${rootDir}/package.json`
  const exists = fs.existsSync(pkgPath)

  if (exists) return true

  const errorMessage = installErrorMessage({ npmPackage })
  return new Promise((resolve) => {
    spawn(
      'npm',
      ['init', '-y'],
      {
        cwd: rootDir,
        stdio: 'inherit',
      },
      {
        onError: (error) => {
          onError({
            error: error as Error,
            message: errorMessage,
          })

          process.exit(1)
        },
        onClose: (code) => {
          if (code !== 0) {
            onError({ message: errorMessage })
            process.exit(1)
          } else {
            resolve(true)
          }
        },
      },
    )
  })
}

function getPackageName({ srcPath }: { srcPath: string }) {
  const config = loadConfig({ sourcePath: srcPath, checkEnvVars: false })
  return getConnectorPackage(config)
}

async function getInstalledVersion({
  npmPackage,
  rootDir,
}: {
  npmPackage: string
  rootDir: string
}) {
  await maybeInitPackageJson({ rootDir, npmPackage })

  const file = fs.readFileSync(`${rootDir}/package.json`, 'utf8')
  const packageJson = JSON.parse(file)
  const dependencies = packageJson.dependencies || {}
  return dependencies[npmPackage]
}

function getConnectorVersionInLatitudeApp({
  rootDir,
  npmPackage,
}: {
  rootDir: string
  npmPackage: string
}) {
  const factoryPackagePath = `${rootDir}/${APP_FOLDER}/node_modules/@latitude-data/connector-factory`
  const factoryPackageJson = JSON.parse(
    fs.readFileSync(`${factoryPackagePath}/package.json`, 'utf8'),
  )

  // NOTE: In production we pick the exec version from the factory package declared
  // as peer dependency in the app package.json
  // In development we just pick the latest version
  const peer = factoryPackageJson.peerDependencies ?? {}
  const version = peer[npmPackage] ?? 'latest' // Legacy factory packages didn't have peer dependencies
  return version.startsWith('workspace:') ? 'latest' : version
}

function hasToInstallConnector({
  installedVersion,
  connectorVersionInApp,
}: {
  installedVersion: string | undefined | null
  connectorVersionInApp: string
}) {
  if (!installedVersion) return false
  // NOTE: In development we avoid comparing with factory
  // because in the monorepo is `workspace:*`
  if (connectorVersionInApp === 'latest') return true

  return installedVersion === connectorVersionInApp
}

export default async function ensureConnectorInstalled({
  rootDir,
  srcPath,
  isSource,
}: {
  rootDir: string
  srcPath: string
  isSource: boolean
}) {
  if (!isSource) return true

  const npmPackage = getPackageName({ srcPath })
  const installedVersion = await getInstalledVersion({
    rootDir,
    npmPackage,
  })
  const connectorVersionInApp = getConnectorVersionInLatitudeApp({
    rootDir,
    npmPackage,
  })

  const isInstalled = hasToInstallConnector({
    installedVersion,
    connectorVersionInApp,
  })

  if (isInstalled) return true

  await installConnector({
    rootDir,
    npmPackage,
    npmVersion: connectorVersionInApp,
  })

  return true
}
