import colors from 'picocolors'
import boxedMessage from '../boxedMessage'
import { getInstalledVersion } from '../versionManagement/appVersion'

export default class InstalledVersionChecker {
  public installed: string | null = null
  public config: string | null = null

  constructor({ cwd, configVersion }: { cwd: string; configVersion: string }) {
    this.installed = getInstalledVersion(cwd)
    this.config = configVersion
  }

  isDifferent() {
    return this.installed !== this.config
  }

  displayMessage(devUrl: string) {
    const message = `
${devUrl}

---------

You're using a different version of Latitude server.
Your machine: ${colors.red(this.installed)}
This project (latitude.json): ${colors.green(this.config)}

Please run to fix this issue:
${colors.blue('latitude update --fix')}
    `
    boxedMessage({
      text: message,
      title: 'Latitude server',
      color: 'green',
    })
  }
}
