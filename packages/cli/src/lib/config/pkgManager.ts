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

export type PackageManagerWithFlags = {
  command: PackageManager
  flags: PackageManagerFlags
}

const PACKAGE_FLAGS: Record<PackageManager, PackageManagerFlags> = {
  npm: {
    mandatoryInstallFlags: [],
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

function getPkgManager(): Promise<PackageManagerWithFlags> {
  return new Promise((resolve) => {
    DESIRED_PACKAGE_MANGERS.find((pm) => {
      checkPackageManager(pm, (installed) => {
        if (installed) {
          resolve({
            command: pm,
            flags: PACKAGE_FLAGS[pm],
          })

          return pm
        }
      })
    })
  })
}

export default getPkgManager
