import config from '$src/config'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'
import {
  getInstalledVersion as getInstalledAppVersion,
  getAvailableVersions as getAvailableAppVersions,
} from '$src/lib/versionManagement/appVersion'
import {
  getInstalledVersion as getInstalledCliVersion,
  getAvailableVersions as getAvailableCliVersions,
} from '$src/lib/versionManagement/cliVersion'
import telemetry from '$src/lib/telemetry'
import updateApp from '$src/lib/versionManagement/updateApp'
import { cleanTerminal, onError } from '$src/utils'
import { select } from '@inquirer/prompts'
import setRootDir from '$src/lib/decorators/setRootDir'

async function selectNewVersion({
  availableVersions,
  canary = false,
  fix,
}: {
  availableVersions: string[]
  fix: boolean
  canary?: boolean
}) {
  const latitudeJson = await findOrCreateConfigFile({ canary })
  const latitudeJsonVersion = latitudeJson.data.version ?? null
  const installedVersion = getInstalledAppVersion(config.rootDir)

  if (fix) {
    return {
      oldVersion: installedVersion,
      newVersion: latitudeJsonVersion,
    }
  }

  try {
    return {
      oldVersion: latitudeJsonVersion,
      newVersion: await select<string>({
        message: 'Pick the Latitude version you want to use',
        choices: availableVersions.map((version, index) => ({
          value: version,
          name: `Latitude v${version}${index === 0 ? ' (latest)' : ''}${
            version === installedVersion ? ' (current)' : ''
          }`,
        })),
      }),
    }
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
    newVersion: null,
  }
}

async function askToUpdateCli(): Promise<boolean> {
  const availableCliVersions = await getAvailableCliVersions({})
  const currentCliVersion = await getInstalledCliVersion()

  if (currentCliVersion === availableCliVersions[0]) {
    return false
  }

  return select({
    message: 'New CLI version available. Upgrade to the latest version too?',
    choices: [
      {
        name: 'Yes (Recommended)',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ],
  })
}

async function updateCommand(args: { fix?: boolean; canary?: boolean }) {
  const fix = args.fix ?? false
  const canary = args.canary ?? false

  console.log('Fetching Latitude versions...')
  const availableAppVersions = await getAvailableAppVersions({
    onFetch: () => cleanTerminal(),
    canary,
  })

  const { oldVersion: oldAppVersion, newVersion: newAppVersion } =
    await selectNewVersion({
      availableVersions: availableAppVersions,
      canary,
      fix,
    })

  if (!newAppVersion) process.exit(1)

  await telemetry.track({
    event: 'updateCommand',
    properties: {
      fixingVersion: fix,
      oldVersion: oldAppVersion ?? 'unknown',
      newVersion: newAppVersion,
    },
  })

  const isLatestAppVersion = newAppVersion === availableAppVersions[0]
  const updateCli = isLatestAppVersion && (await askToUpdateCli())

  return updateApp({
    version: newAppVersion,
    updateCli,
    toLatest: isLatestAppVersion,
    canary,
  })
}

export default setRootDir(updateCommand)
