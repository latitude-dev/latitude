import mri from 'mri'
import path from 'path'
import {
  APP_FOLDER,
  CLOUD_FOLDER,
  LATITUDE_CONFIG_FILE,
} from './commands/constants'

class CLIConfig {
  public dev: boolean
  public prod: boolean
  public test: boolean

  public rootDir: string
  public verbose: boolean
  public tty: boolean

  constructor({
    rootDir,
    dev = true,
    test = false,
    prod = false,
    verbose = false,
    tty = true,
  }: {
    rootDir: string
    dev?: boolean
    test?: boolean
    prod?: boolean
    verbose?: boolean
    tty?: boolean
  }) {
    this.dev = dev
    this.test = test
    this.prod = prod
    this.rootDir = rootDir
    this.verbose = verbose
    this.tty = tty
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))
    this.verbose = args.verbose ?? false
    this.tty = JSON.parse(args.tty ?? 'true')

    const simulatePro = args['simulate-pro'] ?? false
    this.dev = simulatePro ? false : this.dev
    this.test = simulatePro ? false : this.test
    this.prod = simulatePro ? true : this.prod
  }

  public get appDir() {
    return path.join(this.rootDir, APP_FOLDER)
  }

  public get cloudDir() {
    return path.join(this.rootDir, CLOUD_FOLDER)
  }

  public get latitudeJsonPath() {
    return path.join(this.rootDir, LATITUDE_CONFIG_FILE)
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
  test: process.env.NODE_ENV === 'test',
  prod: process.env.NODE_ENV === 'production',
  rootDir: process.cwd(),
})
