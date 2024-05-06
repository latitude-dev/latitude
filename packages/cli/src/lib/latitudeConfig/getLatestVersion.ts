import { onError } from '$src/utils'
import getLatitudeVersions from '../getAppVersions'

export default async function getLatestVersion(
  { next = false }: { next?: boolean } = { next: false },
) {
  try {
    const versions = await getLatitudeVersions({ next })
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
