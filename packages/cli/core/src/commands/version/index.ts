import colors from 'picocolors'
import setRootDir from '$src/lib/decorators/setRootDir'
import boxedMessage from '$src/lib/boxedMessage'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'
import { getInstalledVersion } from '$src/lib/versionManagement/appVersion'
import config from '$src/config'

function versionLine({ name, version }: { name: string; version: string }) {
  return `${colors.blue(`${name} version: `)} ${colors.green(version)}`
}
async function showVersions() {
  const latitudeJson = await findOrCreateConfigFile()
  const appVersion = latitudeJson.data.version
  const installed = getInstalledVersion(config.appDir)
  boxedMessage({
    color: 'green',
    title: 'Latitude versions',
    text: `
      ${versionLine({
        name: 'CLI',
        version: process.env.PACKAGE_VERSION ?? 'development',
      })}
      ${versionLine({ name: 'App (latitude.json)', version: appVersion! })}
      ${
        installed
          ? versionLine({ name: 'App (installed)', version: installed })
          : '\n'
      }
      ${
        !installed
          ? colors.red("App is not installed run 'latitude setup'")
          : ''
      }
    `,
  })
}

export default setRootDir(showVersions)
