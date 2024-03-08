import { exec } from 'child_process'
import path from 'path'
import { DEV_SITES_ROUTE_PREFIX } from './commands/constants'

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
type PackageManagerWithFlags = {
  command: PackageManager
  flags: PackageManagerFlags
}

class CLIConfig {
  private static instance: CLIConfig
  public cwd: string = this.getDefaultCwd()
  public debug: boolean = false
  public dev: boolean = true
  public pro: boolean = false
  public simulatedPro: boolean = false
  public pkgManager: PackageManagerWithFlags = {
    command: PackageManager.npm,
    flags: PACKAGE_FLAGS[PackageManager.npm],
  }

  public static getInstance(): CLIConfig {
    if (CLIConfig.instance) return this.instance

    this.instance = new CLIConfig()
    return this.instance
  }

  async setPkgManager() {
    const pkg = await this.getPackageManager()
    const flags = PACKAGE_FLAGS[pkg]
    this.pkgManager = {
      command: pkg,
      flags,
    }
  }

  setDev({ dev, args }: { dev: boolean; args: string[] }) {
    const simulatedPro = this.isSimulatedPro(args)
    this.dev = dev
    this.pro = !this.dev
    this.simulatedPro = simulatedPro
  }

  setDebug(args: string[]) {
    if (Array.isArray(args)) {
      this.debug = !!(args[0] as unknown as { debug?: boolean })?.debug
    }
  }

  setCwd(args: string[]) {
    if (Array.isArray(args)) {
      const folder = (args[0] as unknown as { folder?: string })?.folder

      if (folder) this.cwd = path.join(this.getDefaultCwd(), folder)
      else this.cwd = this.getDefaultCwd()
    }
  }

  private isSimulatedPro(args: string[]): boolean {
    if (!Array.isArray(args)) return false

    return !!(args[0] as unknown as { 'simulate-pro': boolean })?.[
      'simulate-pro'
    ]
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
}

export default CLIConfig.getInstance()
