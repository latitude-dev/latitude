import fs from 'fs'
import spawn from '$src/lib/spawn'
import colors from 'picocolors'
import { onError } from '$src/utils'
import {
  ConnectorType,
  InvalidConnectorType,
  MissingEnvVarError,
  getConnectorPackage,
  loadConfig,
} from '@latitude-data/connector-factory'
import config from '$src/config'
import isSourceFile from '$src/lib/isSourceFile'

function installErrorMessage({ npmPackage }: { npmPackage: string }) {
  return `
🚨 Failed to install connector ${npmPackage}

To install manually the connector run:
'npm install --save ${npmPackage}' in the app directory.
`
}

function installConnector({
  npmPackage,
  npmVersion,
}: {
  npmPackage: string
  npmVersion: string
}) {
  const errorMessage = installErrorMessage({ npmPackage })
  console.log(colors.yellow(`Installing connector ${npmPackage}...`))
  return new Promise((resolve) => {
    spawn(
      'npm',
      ['install', '--save', `${npmPackage}@${npmVersion}`],
      {
        cwd: config.rootDir,
        stdio: 'pipe',
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

function getPackageName({ srcPath }: { srcPath: string }) {
  try {
    const source = loadConfig({ sourcePath: srcPath })
    return getConnectorPackage(source.type as ConnectorType)
  } catch (e) {
    if (e instanceof MissingEnvVarError) return
    if (e instanceof InvalidConnectorType) return

    throw e
  }
}

function getConnectorVersionInLatitudeApp({
  npmPackage,
}: {
  npmPackage: string
}) {
  const factoryPackagePath = `${config.appDir}/node_modules/@latitude-data/connector-factory`
  const factoryPackageJson = JSON.parse(
    fs.readFileSync(`${factoryPackagePath}/package.json`, 'utf8'),
  )

  // NOTE: In production we pick the exec version from the factory package declared
  // as peer dependency in the app package.json
  // In development we just pick the latest version
  const peer = factoryPackageJson.peerDependencies ?? {}
  const version = peer[npmPackage] ?? 'latest' // Legacy factory packages didn't have peer dependencies
  return config.dev ? 'latest' : version
}

export default function ensureConnectorInstalled({
  srcPath,
  type,
}: {
  srcPath: string
  type: 'add' | 'change' | 'unlink'
}) {
  if (!isSourceFile(srcPath)) return
  if (type !== 'add' && type !== 'change') return

  const npmPackage = getPackageName({ srcPath })
  if (!npmPackage) return

  const connectorVersionInApp = getConnectorVersionInLatitudeApp({
    npmPackage,
  })

  return installConnector({ npmPackage, npmVersion: connectorVersionInApp })
}
