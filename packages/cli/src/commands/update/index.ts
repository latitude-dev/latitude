import colors from 'picocolors'
import { prompt } from 'enquirer'
import setupApp from '../../lib/setupApp'
import { cleanTerminal, onError } from '../../utils'
import { DEFAULT_VERSION_LIST } from '../constants'
import config from '../../config'
import { getLatitudeVersions } from '../../lib/getAppVersions'

type Version = { version: string }
async function askForAppVersion() {
  let versions: string[] = DEFAULT_VERSION_LIST
  try {
    console.log(colors.yellow('Fetching Latitude versions...'))
    versions = await getLatitudeVersions({
      pkgManager: config.pkgManager,
      onFetch: () => cleanTerminal(),
    })
  } catch {
    // Already handled in onError
  }

  return prompt<Version>([
    {
      type: 'select',
      name: 'version',
      message: 'Pick the Latitude version you want to use',
      initial: 0, // Newest version by default
      choices: versions.map((version, index) => ({
        name: version,
        message: `Latitude v${version}${index === 0 ? ' (latest)' : ''}`,
      })),
    },
  ])
}

export default async function updateCommand(args: { fix?: boolean }) {
  const fix = args.fix ?? false

  if (fix) {
    // If --fix flag is passed, use the version defined in latitude.json
    // This means user had installed a different version and wants to fix it
    return setupApp({ appVersion: config.projectConfig.appVersion })
  }

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

  return setupApp({ appVersion: response.version })
}
