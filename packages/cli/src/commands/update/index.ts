import { exec } from 'child_process'
import colors from 'picocolors'
import { prompt } from 'enquirer'
import semverSort from 'semver/functions/rsort'
import setupApp from '../../lib/setupApp'
import { CommonCLIArgs } from '../../types'
import { cleanTerminal, onError } from '../../utils'
import { getDefaultCwd } from '../dev/runLatitudeServer'
import config from '../../config'
import { PACKAGE_NAME } from '../constants'

const DEFAULT_VERSION_LIST = ['latest'] // If we fail to get the list

async function getLatitudeVersions() {
  const command = `${config.pkgManager.command} view ${PACKAGE_NAME} versions --json`
  return new Promise<string[]>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      cleanTerminal()

      if (error) {
        reject(error)
      }

      if (stderr) {
        reject(stderr)
      }

      let versions: string[] | undefined = undefined
      try {
        versions = JSON.parse(stdout)
      } catch (e) {
        reject(e)
        // Do nothing
      }

      const loose = false // Don't include pre-release versions
      if (!versions) return resolve(DEFAULT_VERSION_LIST)

      const sorted = semverSort(versions, loose).slice(0, 10) // Last 10 versions
      resolve(sorted)
    })
  })
}

type Version = { version: string }
async function askForAppVersion() {
  let versions: string[] = DEFAULT_VERSION_LIST
  try {
    console.log(colors.yellow('Fetching Latitude versions...'))
    versions = await getLatitudeVersions()
  } catch {
    // Already handled in onError
  }

  return prompt<Version>([
    {
      type: 'select',
      name: 'version',
      message: 'Pick the Latitute version you want to use',
      initial: 0, // Newest version by default
      choices: versions.map((version, index) => ({
        name: version,
        message: `Latitude v${version}${index === 0 ? ' (latest)' : ''}`,
      })),
    },
  ])
}

export default async function updateCommand(args: CommonCLIArgs = {}) {
  const dataAppDir = args?.folder ? `/ ${args.folder}` : ''
  const appFolder = `${getDefaultCwd()}${dataAppDir}`

  let response: { version: string } | undefined
  try {
    response = await askForAppVersion()
  } catch (error) {
    if (!error) {
      console.log(
        colors.yellow('🙈 Mission aborted, when you are ready, try again'),
      )
    } else {
      onError({
        error: error as Error,
        message: 'Failed to get Latitude versions',
        color: 'red',
      })
    }
  }

  // Errors already handled
  if (!response || !response.version) return

  return setupApp({
    onError,
    destinationPath: appFolder,
    appVersion: response.version,
  })
}
