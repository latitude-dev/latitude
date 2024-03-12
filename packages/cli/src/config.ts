import { exec } from 'child_process'
import mri from 'mri'
import {
  APP_FOLDER,
  DEV_SITES_ROUTE_PREFIX,
  LATITUDE_CONFIG_FILE,
} from './commands/constants'
import path from 'path'
import { findConfigFile } from './lib/latitudeConfig/findOrCreate'
import validateFn from './lib/latitudeConfig/validate'

enum PackageManager {
  pnpm = 'pnpm',
  npm = 'npm',
}

type PackageManagerFlags = {
  mandatoryInstallFlags: string[]
  installFlags: {
    silent: string
  }
}
const PACKAGE_FLAGS: Record<PackageManager, PackageManagerFlags> = {
  npm: {
    mandatoryInstallFlags: ['--legacy-peer-deps'],
    installFlags: {
      silent: '--silent',
    },
  },
  pnpm: {
    mandatoryInstallFlags: [
      '--strict-peer-dependencies=false',
      '--ignore-workspace',
    ],
    installFlags: {
      silent: '--silent',
    },
  },
}

const DESIRED_PACKAGE_MANGERS = [PackageManager.pnpm, PackageManager.npm]

function checkPackageManager(
  packageManager: PackageManager,
  callback: (arg0: boolean) => void,
) {
  exec(`${packageManager} --version`, (error) => {
    if (error) {
      callback(false) // Indicates that the package manager is not installed
    } else {
      callback(true) // Indicates that the package manager is installed
    }
  })
}
export type PackageManagerWithFlags = {
  command: PackageManager
  flags: PackageManagerFlags
}

const DEPLOY_PLATFORMS = {
  vercel: 'vercel',
  netlify: 'netlify',
  aws: 'aws',
  cloudflare: 'cloudflare',
  nodejs: 'nodejs',
}

export type DeployPlatform = keyof typeof DEPLOY_PLATFORMS

export type PartialLatitudeConfig = {
  projectName: string
  appVersion: string
  deployPlatform: DeployPlatform
}

const INGORED_LOAD_CONFIG_COMMANDS = ['start', 'telemetry']
function getConfig(appDir: string) {
  const config = findConfigFile({ appDir, throws: true })

  if (!config) return null

  return config.data as unknown as PartialLatitudeConfig
}

class CLIConfig {
  private static instance: CLIConfig
  public cwd: string
  public debug: boolean = false
  public dev: boolean = true
  public pro: boolean = false
  public simulatedPro: boolean = false
  public pkgManager: PackageManagerWithFlags = {
    command: PackageManager.npm,
    flags: PACKAGE_FLAGS[PackageManager.npm],
  }
  private _latitudeConfig: PartialLatitudeConfig | null = null

  constructor() {
    this.dev = process.env.NODE_ENV === 'development'
    this.pro = !this.dev
    this.cwd = this.getDefaultCwd()
  }

  public static getInstance(): CLIConfig {
    if (CLIConfig.instance) return this.instance

    this.instance = new CLIConfig()
    return this.instance
  }

  public async init(argv: string[]) {
    const args = mri(argv.slice(2))
    const requireConfig = this.hasToLoadConfig(args._[0])
    this.debug = (args.debug as boolean | undefined) ?? false
    this.simulatedPro = args['simulate-pro'] ?? false,
    this.addFolderToCwd(args.folder)

    await this.setPkgManager()

    if (requireConfig) {
      this.loadConfig()
    }
  }

  async setPkgManager() {
    const pkg = await this.getPackageManager()
    const flags = PACKAGE_FLAGS[pkg]
    this.pkgManager = {
      command: pkg,
      flags,
    }
  }

  public loadConfig() {
    const latConfig = getConfig(this.cwd)

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
      projectName: latConfig.projectName,
      appVersion: latConfig.appVersion,
      deployPlatform: latConfig.deployPlatform,
    }
  }

  private hasToLoadConfig(command: string | undefined) {
    if (!command) return false

    return !INGORED_LOAD_CONFIG_COMMANDS.includes(command)
  }

  get projectConfig(): PartialLatitudeConfig {
    return this._latitudeConfig!
  }

  setCwd(cwd: string) {
    if (!cwd) return

    this.cwd = cwd
  }

  addFolderToCwd(folder: string | undefined) {
    if (!folder) return

    this.cwd = path.join(this.cwd, folder)
  }

  private async getPackageManager(): Promise<PackageManager> {
    return new Promise((resolve) => {
      DESIRED_PACKAGE_MANGERS.find((pm) => {
        checkPackageManager(pm, (installed) => {
          if (installed) {
            resolve(pm)
            return pm
          }
        })
      })
    })
  }

  private getDefaultCwd() {
    const naturalCwd = process.cwd()

    if (this.pro) return naturalCwd

    return path.join(naturalCwd, DEV_SITES_ROUTE_PREFIX)
  }

  get appDir() {
    return path.join(this.cwd, APP_FOLDER)
  }
}

export default CLIConfig.getInstance()
