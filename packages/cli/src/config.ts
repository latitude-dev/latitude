import mri from 'mri'
import path from 'path'
import { APP_FOLDER, LATITUDE_CONFIG_FILE } from './commands/constants'

export type PartialLatitudeConfig = {
  name: string
  version: string
}

class CLIConfig {
  public rootDir: string
  public dev: boolean = true
  public verbose: boolean = false
  private _pro: boolean = false
  private _simulatedPro: boolean = false

  constructor({
    dev,
    rootDir,
    verbose = false,
    simulatedPro = false,
  }: {
    rootDir: string
    dev: boolean
    verbose?: boolean
    simulatedPro?: boolean
  }) {
    this.dev = dev
    this.rootDir = rootDir
    this.verbose = verbose
    this._pro = !this.dev
    this._simulatedPro = simulatedPro
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))
    this._simulatedPro = args['simulate-pro'] ?? false
    this.verbose = args.debug ?? false
  }

  public get appDir() {
    return path.join(this.rootDir, APP_FOLDER)
  }

  public get latitudeJsonPath() {
    return path.join(this.rootDir, LATITUDE_CONFIG_FILE)
  }

  public get pro() {
    return this._pro || this._simulatedPro
  }

  public get name() {
    return path.basename(this.rootDir)
  }
}

export default new CLIConfig({
  dev: process.env.NODE_ENV === 'development',
  rootDir: process.cwd(),
})
