import { onError } from '$src/utils'
import { getAvailableVersions } from '../versionManagement/appVersion'

export default async function getLatestVersion(
  { canary = false }: { canary?: boolean } = { canary: false },
) {
  try {
    const versions = await getAvailableVersions({ canary })
    const latestVersion = versions[0]

    if (!latestVersion) {
      onError({
        message:
          'No Latitude versions found. If the issue persits, please report it.',
      })

      process.exit(1)
    }

    return latestVersion
  } catch (error) {
    onError({
      message: 'Error getting Latitude versions',
      error: error as Error,
    })

    process.exit(1)
  }
}
