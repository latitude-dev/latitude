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

function checkInstalled({ npmPackage }: { npmPackage: string }) {
  const installMessage = colors.yellow(`
Connector ${npmPackage} not installed. To install it run:

${colors.cyan(`npm install --save ${npmPackage}`)}
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

  return checkInstalled({ npmPackage })
}
