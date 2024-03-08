import { exec } from 'child_process'

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
  private _debug: boolean = false
  private _dev: boolean = false
  private _pro: boolean = true
  private _simulatedPro: boolean = false
  public _pkgManager: PackageManagerWithFlags = {
    command: PackageManager.npm,
    flags: PACKAGE_FLAGS[PackageManager.npm],
  }

  public static getInstance(): CLIConfig {
    if (CLIConfig.instance) return this.instance

    this.instance = new CLIConfig()
    return this.instance
  }

  get dev(): boolean {
    return this._dev
  }

  get pro(): boolean {
    return this._pro
  }

  get simulatedPro(): boolean {
    return this._simulatedPro
  }

  get pkgManager(): PackageManagerWithFlags {
    return this._pkgManager
  }

  async setupPkgManager() {
    const pkg = await this.getPackageManager()
    const flags = PACKAGE_FLAGS[pkg]
    this._pkgManager = {
      command: pkg,
      flags,
    }
  }

  setDev({ dev, args }: { dev: boolean; args: string[] }) {
    const simulatedPro = this.isSimulatedPro(args)
    this._dev = dev
    this._simulatedPro = simulatedPro
    this._pro = !this._dev
  }

  get debug(): boolean {
    return this._debug
  }

  set debug(args: string[]) {
    if (Array.isArray(args)) {
      this._debug = !!(args[0] as unknown as { debug?: boolean })?.debug
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
}

export default CLIConfig.getInstance()
