import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import watcher from './common/watcher'
import output from './common/output'

export const copiedFiles = new Set<string>()
export default async function watchViews({
  dataAppDir,
  destinationDir,
}: {
  dataAppDir: string
  destinationDir: string
}): Promise<void> {
  const views = path.join(dataAppDir, 'views')

  const syncFile = (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => {
    const relativeSrcPath = path
      .relative(dataAppDir, srcPath)
      .replace(/^views/, '')
    const relativePath = relativeSrcPath.replace(/[^/]*$/, '+page.svelte')
    const destPath = path.join(destinationDir, relativePath)

    if (type === 'add' || type === 'change') {
      // Make sure all directories in the path exist
      fs.mkdirSync(path.dirname(destPath), { recursive: true })

      fs.copyFile(srcPath, destPath, (err) => {
        if (err) {
          return output(
            colors.red(
              `${relativePath} could not be copied to ${destPath}: ${err}`,
            ),
            ready,
          )
        } else {
          output(colors.gray(`${relativeSrcPath} synced`), ready)
        }
      })

      copiedFiles.add(destPath)
    } else if (type === 'unlink') {
      fs.unlink(destPath, (err) => {
        if (err) {
          output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
        } else {
          copiedFiles.delete(destPath)
        }
      })
    }
  }

  await watcher(views, syncFile, {
    ignored: /(?!.*\/index\.html$)(^|[/\\])\../, // ignore all files except index.html
    persistent: true,
  })

  console.log(colors.green('Watching [views]...'))

  process.on('exit', () => {
    for (const copiedFile of copiedFiles) {
      fs.unlink(copiedFile, (err) => {
        if (err) {
          console.log(
            colors.red(`File ${copiedFile} could not be deleted: ${err}`),
          )
        }
      })
    }
  })
}
