import config from '$src/config'
import dockerfileTemplate from '../../templates/Dockerfile.template'
import dockerignoreTemplate from '../../templates/dockerignore.template'
import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import installDependencies from './installDependencies'
import installLatitudeServer from '../installLatitudeServer'
import path from 'path'
import { createMasterKey } from '$src/commands/credentials/createMasterKey'
import { existsSync, writeFileSync } from 'fs'
import { onError } from '$src/utils'

export type Props = { version?: string }

function addPackageJson() {
  const packageJsonPath = path.resolve(config.rootDir, 'package.json')
  if (existsSync(packageJsonPath)) return

  const packageJson = config.dev
    ? {
        scripts: {
          'latitude-dev': '../../node_modules/.bin/latitude',
        },
      }
    : {}

  try {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  } catch (e) {
    onError({
      error: e as Error,
      message: '🚨 Failed to create package.json file',
    })

    process.exit(1)
  }
}

function addDockerignore(
  { force = false }: { force: boolean } = { force: false },
) {
  const dockerignorePath = path.resolve(config.rootDir, '.dockerignore')
  if (!force && existsSync(dockerignorePath)) return

  try {
    writeFileSync(dockerignorePath, dockerignoreTemplate)
  } catch (e) {
    onError({
      error: e as Error,
      message: '🚨 Failed to create .dockerignore file',
    })

    process.exit(1)
  }
}

function addDockerfile(
  { force = false }: { force: boolean } = { force: false },
) {
  const dockerfilePath = path.resolve(config.rootDir, 'Dockerfile')
  if (!force && existsSync(dockerfilePath)) return

  try {
    writeFileSync(dockerfilePath, dockerfileTemplate)
  } catch (e) {
    onError({
      error: e as Error,
      message: '🚨 Failed to create Dockerfile',
    })

    process.exit(1)
  }
}

export function addDockerfiles(
  { force = false }: { force: boolean } = { force: false },
) {
  addDockerignore({ force })
  addDockerfile({ force })
}

export default async function setupApp() {
  const config = await findOrCreateConfigFile()
  await installLatitudeServer({ version: config.data.version })
  await installDependencies()
  addPackageJson()
  addDockerfiles()
  createMasterKey()
}
