import config from '$src/config'
import path from 'path'
import watcher from '../shared/watcher'
import syncFiles from '../shared/syncFiles'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'fs'
import { onExit } from '$src/utils'
import isConfigFile from '$src/lib/isConfigFile'

function buildDestPath({
  srcPath,
  destinationPromptsDir,
}: {
  srcPath: string
  destinationPromptsDir: string
}) {
  const relativePath = path
    .relative(config.rootDir, srcPath)
    .replace(/^prompts\/?/, '')

  let destPath

  if (srcPath.endsWith('.prompt') || isConfigFile(srcPath)) {
    return {
      destPath: path.join(destinationPromptsDir, relativePath),
      relativePath,
    }
  }

  return { destPath, relativePath }
}

export function syncDirectory(dirPath: string, syncFn: Function): void {
  if (!existsSync(dirPath)) return

  readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
    const currentPath = path.join(dirPath, dirent.name)
    if (dirent.isDirectory()) {
      syncDirectory(currentPath, syncFn)
    } else {
      syncFn(currentPath, 'add', true)
    }
  })
}

export function clearFolders(folders: string[]) {
  folders.forEach((folder) => {
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true })
    }

    readdirSync(folder).forEach((file: string) => {
      const filePath = path.join(folder, file)
      if (statSync(filePath).isDirectory()) {
        rmSync(filePath, { recursive: true })
      } else {
        unlinkSync(filePath)
      }
    })
  })
}

export function syncPromptsFiles({
  destinationPromptsDir,
}: {
  destinationPromptsDir: string
}) {
  return async (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const { destPath, relativePath } = buildDestPath({
      srcPath,
      destinationPromptsDir,
    })

    // Not a valid extension .prompt, .yml or .yaml
    if (!destPath) return

    syncFiles({ srcPath, relativePath, destPath, type, ready })
  }
}

export default async function syncPrompts({
  watch = false,
}: {
  watch?: boolean
}) {
  const rootDir = config.rootDir
  const promptsDir = path.join(rootDir, 'prompts')
  const destinationPromptsDir = config.promptsDir

  clearFolders([destinationPromptsDir])

  const syncFn = syncPromptsFiles({
    destinationPromptsDir,
  })

  if (watch) {
    await watcher(promptsDir, syncFn, { debug: config.verbose })
  } else {
    syncDirectory(promptsDir, syncFn)
  }

  onExit(() => {
    if (!watch) return

    clearFolders([destinationPromptsDir])
  })
}
