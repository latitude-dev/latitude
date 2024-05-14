import fs from 'fs'
import colors from 'picocolors'
import config from '$src/config'
import { SourceManager } from '@latitude-data/source-manager'
import isSourceFile from '$src/lib/isSourceFile'

let _sourceManager: SourceManager
function currentSourceManager(): SourceManager {
  // If config root dir changed, we must update the source manager.
  if (_sourceManager?.queriesDir !== config.queriesDir) {
    _sourceManager?.clearAll()
    _sourceManager = new SourceManager(config.queriesDir)
  }

  return _sourceManager
}

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
    if (e?.code === 'ENOENT') {
      console.log(installMessage)
    }

    throw e
  }
}

export default async function ensureConnectorInstalled(
  sourcePath: string,
  type: 'add' | 'change' | 'unlink',
) {
  if (!isSourceFile(sourcePath)) return

  const sourceManager = currentSourceManager()
  let source = await sourceManager.loadFromConfigFile(sourcePath)

  if (type === 'unlink') {
    await sourceManager.clear(source)
    return
  }

  if (type === 'change') {
    await sourceManager.clear(source)
    source = await sourceManager.loadFromConfigFile(sourcePath)
  }

  const npmPackage = source.connectorPackageName
  return checkInstalled({ npmPackage })
}
