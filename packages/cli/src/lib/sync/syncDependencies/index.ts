import config from '$src/config'
import path from 'path'
import watcher from '../shared/watcher'
import { APP_FOLDER } from '$src/commands/constants'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import colors from 'chalk'
import spawn from '$src/lib/spawn'

export default async function syncDependencies(
  { watch }: { watch?: boolean } = { watch: false },
) {
  const root = path.join(config.cwd, 'package.json')
  const target = path.join(config.cwd, APP_FOLDER, 'package.json')
  const {
    dependencies: defaultDependencies = {},
    devDependencies: defaultDevDependencies = {},
  } = getDefaultDeps(target)

  await sync({ root, target, defaultDependencies, defaultDevDependencies })()

  if (watch) {
    await watcher(
      root,
      sync({ root, target, defaultDependencies, defaultDevDependencies }),
    )
  }
}

export const sync =
  ({
    root,
    target,
    defaultDependencies,
    defaultDevDependencies,
  }: {
    root: string
    target: string
    defaultDependencies: Record<string, string>
    defaultDevDependencies: Record<string, string>
  }) =>
  () =>
    new Promise<void>((resolve, reject) => {
      let install = false

      // First, check if the root package.json exists
      if (!existsSync(root)) {
        setDefaultDependencies(target, {
          dependencies: defaultDependencies,
          devDependencies: defaultDevDependencies,
        })

        return resolve()
      }

      try {
        const rootPackage = JSON.parse(readFileSync(root, 'utf8'))
        const targetPackage = JSON.parse(readFileSync(target, 'utf8'))
        const deps = ['dependencies', 'devDependencies']

        deps.forEach((dep) => {
          const diff = computeDiff(rootPackage[dep], targetPackage[dep])
          if (diff.length === 0) return

          install = true

          targetPackage[dep] = {
            ...targetPackage[dep],
            ...rootPackage[dep],
          }

          writeFileSync(target, JSON.stringify(targetPackage, null, 2))
        })

        if (install) {
          console.log(colors.gray('Syncing dependencies with Latitude...'))

          spawn(
            config.pkgManager.command,
            ['install'],
            {},
            {
              onClose: () => {
                console.log(colors.gray('Dependencies synced!'))
                resolve()
              },
              onError: (error) => reject(error),
            },
          )
        } else {
          resolve()
        }
      } catch (error) {
        console.log(colors.red('Failed to sync dependencies:', error))

        setDefaultDependencies(target, {
          dependencies: defaultDependencies,
          devDependencies: defaultDevDependencies,
        })

        resolve()
      }
    })

const getDefaultDeps = (target: string) => {
  if (!existsSync(target)) return {}

  try {
    const { dependencies, devDependencies } = JSON.parse(
      readFileSync(target, 'utf8'),
    )

    return { dependencies, devDependencies }
  } catch (_) {
    // TODO: console.log if debug flag is true

    return {}
  }
}

const setDefaultDependencies = (
  target: string,
  {
    dependencies,
    devDependencies,
  }: { dependencies: any; devDependencies: any },
) => {
  writeFileSync(
    target,
    JSON.stringify(
      {
        dependencies,
        devDependencies,
      },
      null,
      2,
    ),
  )
}

export const computeDiff = (
  root: Record<string, string> = {},
  target: Record<string, string> = {},
) => {
  const diffs: Record<string, string>[] = []

  Object.entries(root).forEach(([key, value]) => {
    if (target[key] !== value) {
      diffs.push({
        key,
        value,
      })
    }
  })

  return diffs
}
