import fsExtra from 'fs-extra'
import colors from 'picocolors'
import boxedMessage from '$src/lib/boxedMessage'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'
import { getInstalledVersion } from '$src/lib/versionManagement/appVersion'
import config from '$src/config'

function versionLine({ name, version }: { name: string; version: string }) {
  return `${colors.blue(`${name} version: `)} ${colors.green(version)}`
}

function cliVersion() {
  return process.env.PACKAGE_VERSION ?? 'development'
}

async function showVersionsInApp() {
  const latitudeJson = await findOrCreateConfigFile()
  const appVersion = latitudeJson.data.version
  const installed = getInstalledVersion(config.rootDir)
  boxedMessage({
    color: 'green',
    title: 'Latitude versions',
    text: `
      ${versionLine({ name: 'CLI', version: cliVersion() })}
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

function showVersions() {
  if (!fsExtra.existsSync(config.latitudeJsonPath)) {
    return boxedMessage({
      color: 'green',
      title: 'Latitude CLI version',
      text: `
      ${versionLine({ name: 'CLI', version: cliVersion() })}
    `,
    })
  }

  showVersionsInApp()
}

export default showVersions
