import chalk from 'chalk'
import config from '$src/config'
import findConfigFile from '../latitudeConfig/findConfigFile'
import fsExtra from 'fs-extra'
import installDependencies from '../setupApp/installDependencies'
import installLatitudeServer from '../installLatitudeServer'
import { onError } from '$src/utils'
import { addDockerfiles } from '../setupApp'

async function updateConfigFile({ version }: { version: string }) {
  const latitudeJson = findConfigFile()
  const newLatitudeJson = { ...latitudeJson.data, version }

  try {
    fsExtra.writeJsonSync(config.latitudeJsonPath, newLatitudeJson, {
      spaces: 2,
    })

    console.log(chalk.green(`✅ ${config.name} updated to version ${version}`))
  } catch (error) {
    onError({
      error: error as Error,
      message: `Error writing config file to ${config.latitudeJsonPath}`,
    })
  }
}

export default async function updateApp({ version }: { version: string }) {
  await updateConfigFile({ version })
  await installLatitudeServer({ version })
  await installDependencies()
  addDockerfiles({ force: true })
}
