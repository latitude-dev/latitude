import colors from 'picocolors'
import boxedMessage from '../boxedMessage'
import { getInstalledVersion } from '../getAppVersions'

export default class InstalledVersionChecker {
  public installed: string | null = null
  public config: string | null = null

  constructor(cwd: string, configVersion: string) {
    this.installed = getInstalledVersion(cwd)
    this.config = configVersion
  }

  isDifferent() {
    return this.installed !== this.config
  }

  displayMessage() {
    const message = `
      Your machine: ${colors.red(this.installed)}
      This project: ${colors.green(this.config)}

      Please run to fix this issue:
      ${colors.blue('latitude update --fix')}
    `
    boxedMessage({
      text: message,
      title: 'Different Latitude version detected',
      color: 'yellow',
    })
  }
}
