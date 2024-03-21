import boxedMessage from '$src/lib/boxedMessage'
import chalk from 'chalk'
import configStore from '$src/lib/configStore'
import latestVersion from 'latest-version'
import { CLIConfig } from '$src/config'
import { CLI_PACKAGE_NAME } from '$src/commands/constants'

const ONE_DAY = 1000 * 60 * 60 * 24

export default function versionCheck(commandFn: Function) {
  return async function (...args: any[]) {
    try {
      const lastCheckedAt = configStore.get('lastCheckedAt')
      // return if checked less than a day ago
      if (lastCheckedAt && Date.now() - lastCheckedAt < ONE_DAY) {
        return commandFn(...args)
      }

      console.log(chalk.gray('Checking for updates...'))

      configStore.set('lastCheckedAt', Date.now())

      const latest = await latestVersion(CLI_PACKAGE_NAME)
      if (latest !== process.env.PACKAGE_VERSION) {
        boxedMessage({
          title: 'Update available',
          color: 'yellow',
          textAlignment: 'center',
          text: `
A new version of @latitude-data/cli is available. 

Current: ${chalk.red(process.env.PACKAGE_VERSION)}
Latest: ${chalk.green(latest)}

Run ${chalk.cyan(
            `${
              CLIConfig.getInstance().pkgManager.command
            } i -g @latitude-data/cli`,
          )} to update.
          `,
        })
      }
    } catch (e) {
      // do nothing
    }

    return commandFn(...args)
  }
}
