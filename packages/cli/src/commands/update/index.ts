import config from '$src/config'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'
import getLatitudeVersions, {
  getInstalledVersion,
} from '$src/lib/getAppVersions'
import telemetry from '$src/lib/telemetry'
import updateApp from '$src/lib/updateApp'
import { DEFAULT_VERSION_LIST } from '../constants'
import { cleanTerminal, onError } from '$src/utils'
import { select } from '@inquirer/prompts'
import setRootDir from '$src/lib/decorators/setRootDir'

async function askForAppVersion(
  { next = false }: { next?: boolean } = { next: false },
) {
  let versions: string[] = DEFAULT_VERSION_LIST
  try {
    console.log('Fetching Latitude versions...')
    versions = await getLatitudeVersions({
      onFetch: () => cleanTerminal(),
      next,
    })
  } catch {
    // Already handled in onError
  }

  return select<string>({
    message: 'Pick the Latitude version you want to use',
    choices: versions.map((version, index) => ({
      value: version,
      name: `Latitude v${version}${index === 0 ? ' (latest)' : ''}`,
    })),
  })
}

async function getVersions({
  next = false,
  fix,
}: {
  next?: boolean
  fix: boolean
}) {
  const latitudeJson = await findOrCreateConfigFile({ next })

  if (fix) {
    return {
      oldVersion: getInstalledVersion(config.appDir),
      newVersion: latitudeJson.data.version,
    }
  }

  let newVersion = null
  try {
    newVersion = await askForAppVersion({ next })
  } catch (error) {
    if (!error) {
      console.log('🙈 Mission aborted, when you are ready, try again')
    } else {
      onError({
        error: error as Error,
        message: 'Failed to get Latitude versions',
        color: 'red',
      })
    }
  }

  return {
    oldVersion: latitudeJson.data.version,
    newVersion,
  }
}

async function updateCommand(args: { fix?: boolean; next?: boolean }) {
  const fix = args.fix ?? false
  const next = args.next ?? false
  const { oldVersion, newVersion } = await getVersions({ next, fix })

  if (!newVersion) process.exit(1)

  await telemetry.track({
    event: 'updateCommand',
    properties: { fixingVersion: fix, oldVersion, newVersion },
  })

  return updateApp({ version: newVersion })
}

export default setRootDir(updateCommand)
