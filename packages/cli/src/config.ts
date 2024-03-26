import mri from 'mri'
import { APP_FOLDER, LATITUDE_CONFIG_FILE } from './commands/constants'
import path from 'path'
import validateFn from './lib/latitudeConfig/validate'
import findConfigFile from './lib/latitudeConfig/findConfigFile'


export type PartialLatitudeConfig = {
  name: string
  version: string
}

// TODO: Review code smell tell don't ask
const INGORED_LOAD_CONFIG_COMMANDS = ['start', 'telemetry']

function getConfig(appDir: string) {
  const config = findConfigFile({ appDir, throws: true })

  if (!config) return null

  return config.data as unknown as PartialLatitudeConfig
}

export class CLIConfig {
  private static instance: CLIConfig
  public source: string
  public debug: boolean = false
  public dev: boolean = true
  public pro: boolean = false
  public simulatedPro: boolean = false
  private _latitudeConfig: PartialLatitudeConfig | null = null

  constructor({ source, dev }: { source: string; dev: boolean }) {
    this.dev = dev
    this.pro = !this.dev
    this.source = source
  }

  public static getInstance(): CLIConfig {
    if (CLIConfig.instance) return this.instance

    this.instance = new CLIConfig({
      dev: process.env.NODE_ENV === 'development',
      source: process.cwd(),
    })
    return this.instance
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))
    const requireConfig = this.hasToLoadConfig(args._[0])
    this.debug = (args.debug as boolean | undefined) ?? false
    this.simulatedPro = args['simulate-pro'] ?? false
    this.addFolderToCwd(args.folder)

    if (requireConfig) {
      this.loadConfig()
    }
  }

  public loadConfig() {
    const latConfig = getConfig(this.source)

    if (!latConfig) {
      throw new Error(
        `Failed to get ${LATITUDE_CONFIG_FILE} config. Make sure you are in a Latitude project`,
      )
    }

    const validated = validateFn(latConfig)

    if (!validated.valid) {
      throw new Error(
        `${validated.errors.message}: ${JSON.stringify(
          validated.errors.errors,
        )}`,
      )
    }

    this._latitudeConfig = {
      name: latConfig.name,
      version: latConfig.version,
    }
  }

  // TODO: Review code smell tell don't ask
  private hasToLoadConfig(command: string | undefined) {
    if (!command) return false

    return !INGORED_LOAD_CONFIG_COMMANDS.includes(command)
  }

  get projectConfig(): PartialLatitudeConfig {
    return this._latitudeConfig!
  }

  setCwd(cwd: string) {
    if (!cwd) return

    this.source = cwd
  }

  addFolderToCwd(folder: string | undefined) {
    if (!folder) return

    this.source = path.join(this.source, folder)
  }

  get appDir() {
    return path.join(this.source, APP_FOLDER)
  }
}
