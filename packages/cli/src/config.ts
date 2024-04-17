import mri from 'mri'
import path from 'path'
import { APP_FOLDER, LATITUDE_CONFIG_FILE } from './commands/constants'

class CLIConfig {
  public rootDir: string
  public dev: boolean = true
  public verbose: boolean = false

  constructor({
    dev,
    rootDir,
    verbose = false,
  }: {
    rootDir: string
    dev: boolean
    verbose?: boolean
  }) {
    this.dev = dev
    this.rootDir = rootDir
    this.verbose = verbose
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))
    this.verbose = args.verbose ?? false

    const simulatePro = args['simulate-pro'] ?? false
    this.dev = simulatePro ? false : this.dev
  }

  public get appDir() {
    return path.join(this.rootDir, APP_FOLDER)
  }

  public get latitudeJsonPath() {
    return path.join(this.rootDir, LATITUDE_CONFIG_FILE)
  }

  public get pro() {
    return !this.dev
  }

  public get name() {
    return path.basename(this.rootDir)
  }

  public get queriesDir() {
    return path.join(this.rootDir, APP_FOLDER, 'static', '.latitude', 'queries')
  }
}

export default new CLIConfig({
  dev: process.env.NODE_ENV === 'development',
  rootDir: process.cwd(),
})
