import path from 'path'
import watcher from '../shared/watcher'
import { APP_FOLDER } from '$src/commands/constants'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import colors from 'chalk'
import spawn from '$src/lib/spawn'
import { CLIConfig } from '$src/config'

export default async function syncDependencies(
  { config, watch }: { config: CLIConfig, watch?: boolean },
) {
  const root = path.join(config.source, 'package.json')
  const target = path.join(config.source, APP_FOLDER, 'package.json')

  await sync({ config, root, target })()

  if (watch) await watcher(root, sync({ config, root, target }))
}

export const sync =
  ({ root, target }: { config: CLIConfig, root: string; target: string }) =>
  () =>
    new Promise<void>((resolve, reject) => {
      let install = false

      if (!existsSync(root)) return resolve()

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
        spawn(
          'npm',
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
    })

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
