import { exec } from 'child_process'
import mri from 'mri'
import {
  LATITUDE_SERVER_FOLDER,
  LATITUDE_CONFIG_FILE,
} from './commands/constants'
import path from 'path'
import validateFn from './lib/latitudeConfig/validate'
import findOrCreateConfigFile from './lib/latitudeConfig/findOrCreate'

export type PartialLatitudeConfig = {
  name: string
  version: string
}

export class CLIConfig {
  private static instance: CLIConfig

  public source: string
  public dev: boolean = true
  public pro: boolean = false
  public debug: boolean = false
  public simulatedPro: boolean = false

  constructor({ source, dev }: { source: string; dev: boolean }) {
    this.dev = dev
    this.pro = !this.dev
    this.source = source
  }

  public static getInstance(): CLIConfig {
    if (!this.instance) {
      this.instance = new CLIConfig({
        dev: process.env.NODE_ENV === 'development',
        source: process.cwd(),
      })
    }

    return this.instance
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))

    this.debug = (args.debug as boolean | undefined) ?? false
    this.simulatedPro = args['simulate-pro'] ?? false
    this.latitudeConfig = await this.loadConfig()
  }

  public loadConfig() {
    const config = await findOrCreateConfigFile()

    this._latitudeConfig = {
      name: latConfig.name,
      version: latConfig.version,
    }
  }

  get projectConfig(): PartialLatitudeConfig {
    return this._latitudeConfig!
  }

  setSource(cwd: string) {
    if (!cwd) return

    this.source = cwd
  }

  private async getPackageManager(): Promise<PackageManager> {}

  get appDir() {
    return path.join(this.source, LATITUDE_SERVER_FOLDER)
  }
}
