import config from '$src/config'
import findConfigFile from '../latitudeConfig/findConfigFile'
import fsExtra from 'fs-extra'
import installLatitudeServer from '../installLatitudeServer'
import { onError } from '$src/utils'
import installDependencies from '../installDependencies/fromUpdate'
import { addDockerfiles } from '../addDockerfiles/fromUpdate'
import addPackageJson from '../addPackageJson'
import updateLatitudeCli from './updateLatitudeCli'
import ora from 'ora'

async function performTask<T extends any>({
  task,
  loading,
  success,
  fail,
  required = true,
}: {
  task: Promise<T>
  loading: string
  success: string
  fail: string
  required?: boolean
}): Promise<T | undefined> {
  const spinner = ora().start(loading)

  try {
    const result = await task
    spinner.succeed(success)
    return result
  } catch (error) {
    if (required) {
      spinner.fail(fail)
      throw error
    }
    spinner.warn(fail)
    return undefined
  }
}

async function updateConfigFile({ version }: { version: string }) {
  const latitudeJson = findConfigFile()
  const newLatitudeJson = { ...latitudeJson.data, version }

  try {
    fsExtra.writeJsonSync(config.latitudeJsonPath, newLatitudeJson, {
      spaces: 2,
    })
  } catch (error) {
    onError({
      error: error as Error,
      message: `Error writing config file to ${config.latitudeJsonPath}`,
    })
  }
}

export default async function updateApp({
  version,
  updateCli = false,
}: {
  version: string
  updateCli: boolean
}) {
  await performTask({
    task: Promise.all([
      updateConfigFile({ version }),
      installLatitudeServer({ version }),
    ]),
    loading: 'Updating Latitude project',
    success: `Project updated to version ${version}`,
    fail: `Failed updating to ${version}`,
  })
  addPackageJson()
  addDockerfiles()
  if (config.prod) {
    await performTask({
      task: installDependencies(),
      loading: 'Installing dependencies',
      success: 'Dependencies installed',
      fail: 'Failed installing dependencies',
    })
  }
  if (updateCli) {
    await performTask({
      task: updateLatitudeCli(),
      loading: 'Updating CLI',
      success: 'Updated CLI to the latest version',
      fail: 'Failed updating CLI',
      required: false,
    })
  }
}
