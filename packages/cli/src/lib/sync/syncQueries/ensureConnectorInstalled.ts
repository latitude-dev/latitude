import fs from 'fs'
import colors from 'picocolors'
import {
  ConnectorType,
  InvalidConnectorType,
  MissingEnvVarError,
  getConnectorPackage,
  loadConfig,
} from '@latitude-data/connector-factory'
import config from '$src/config'
import isSourceFile from '$src/lib/isSourceFile'

function checkInstalled({
  npmPackage,
  npmVersion,
}: {
  npmPackage: string
  npmVersion: string
}) {
  const installMessage = colors.yellow(`
Connector ${npmPackage} not installed. To install it run:

${colors.cyan(`npm install --save ${npmPackage}@${npmVersion}`)}
`)
  try {
    const packageJson = `${config.rootDir}/package.json`
    if (!fs.existsSync(packageJson)) return console.log(installMessage)

    const packageJsonContent = fs.readFileSync(packageJson, 'utf8')
    const packageJsonParsed = JSON.parse(packageJsonContent)
    const dependencies = packageJsonParsed.dependencies ?? {}
    const installedVersion = dependencies[npmPackage]
    if (!installedVersion) {
      console.log(installMessage)

      return
    } else {
      const nodeModules = `${config.rootDir}/node_modules/@latitude-data`
      if (!fs.existsSync(nodeModules)) return console.log(installMessage)

      const nodeModulesContent = fs.readdirSync(nodeModules)
      const installed = nodeModulesContent.includes(npmPackage.split('/')[1]!)
      if (!installed) {
        console.log(installMessage)

        return
      }
    }
  } catch (e) {
    // @ts-expect-error - Property 'code' does not exist on type 'unknown'
    console.log('ERROR: ', e.code)

    // @ts-expect-error - Property 'code' does not exist on type 'unknown'
    if (e?.code === 'ENOENT') {
      console.log(installMessage)
    }

    throw e
  }
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
  try {
    const factoryPackageJson = JSON.parse(
      fs.readFileSync(`${factoryPackagePath}/package.json`, 'utf8'),
    )

    // NOTE: In production we pick the exec version from the factory package declared
    // as peer dependency in the app package.json
    // In development we just pick the latest version
    const peer = factoryPackageJson.peerDependencies ?? {}
    const version = peer[npmPackage] ?? 'latest' // Legacy factory packages didn't have peer dependencies
    return config.dev ? 'latest' : version
  } catch (e) {
    return 'latest'
  }
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

  return checkInstalled({ npmPackage, npmVersion: connectorVersionInApp })
}
