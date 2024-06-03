import colors from 'picocolors'
import setRootDir from '$src/lib/decorators/setRootDir'
import boxedMessage from '$src/lib/boxedMessage'
import findOrCreateConfigFile from '$src/lib/latitudeConfig/findOrCreate'

function versionLine({ name, version }: { name: string; version: string }) {
  return `${colors.blue(`${name} version: `)} ${colors.green(version)}`
}
async function showVersions() {
  const latitudeJson = await findOrCreateConfigFile()
  const appVersion = latitudeJson.data.version
  boxedMessage({
    color: 'green',
    title: 'Latitude versions',
    text: `
      ${versionLine({
        name: 'CLI',
        version: process.env.PACKAGE_VERSION ?? 'development',
      })}
      ${versionLine({ name: 'App', version: appVersion! })}
    `,
  })
}

export default setRootDir(showVersions)
