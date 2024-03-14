import path from 'path'
import config from '$src/config'
import cloneAppFromNpm from './cloneAppFromNpm'
import synlinkAppFromLocal from './synlinkAppFromLocal'
import installAppDependencies from './installDependencies'
import boxedMessage from '../boxedMessage'
import updateVersion from '../latitudeConfig/updateVersion'

export type Props = { version: string }
export default async function setupApp({ version }: Props) {
  let allGood = false

  const isPro = config.pro || config.simulatedPro
  const setup = isPro ? cloneAppFromNpm : synlinkAppFromLocal
  const isSetup = await setup({ version })

  if (!isSetup) return allGood

  process.chdir(path.resolve(config.cwd))

  if (!isPro) {
    allGood = true
    return allGood
  }

  try {
    await installAppDependencies()
    allGood = true
  } catch {
    boxedMessage({
      color: 'red',
      title: '🚨 Failed to install dependencies',
      text: `
      Update latitude and try again. If this does not solve the problem,
      please open an issue on GitHub:
      https://gitub.com/latitude-dev/latitude/issues
      `,
    })
  }

  if (allGood) {
    try {
      await updateVersion({ appDir: config.cwd, version })
    } catch (e) {
      boxedMessage({
        title: '🚨 Failed to update app version',
        text: `Error updating latitude.json ${(e as Error).message}`,
        color: 'red',
      })
    }
  }

  return allGood
}
