import { CLI_PACKAGE_NAME } from '$src/commands/constants'
import spawn from '../spawn'
import getPackageVersions from './getPackageVersions'

export default async function updateLatitudeCli({
  canary = false,
}: {
  canary?: boolean
}) {
  const cliVersions = await getPackageVersions({
    packageName: CLI_PACKAGE_NAME,
    canary,
  })
  const latestVersion = cliVersions[0]
  const packageName = `${CLI_PACKAGE_NAME}@${latestVersion}`

  return new Promise<void>((resolve, reject) => {
    const child = spawn('npm', ['install', '-g', packageName])
    child.on('close', () => resolve())
    child.on('error', (error) => reject(error))
  })
}
