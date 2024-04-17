import colors from 'picocolors'
import output from '../../output'
import path from 'path'
import { copyFileSync, mkdirSync, unlink } from 'fs'

export default function syncFiles({
  srcPath,
  relativePath,
  destPath,
  type,
  ready,
}: {
  srcPath: string
  relativePath: string
  destPath: string
  type: 'add' | 'change' | 'unlink'
  ready: boolean
}) {
  if (type === 'add' || type === 'change') {
    // Make sure all directories in the path exist
    mkdirSync(path.dirname(destPath), { recursive: true })

    try {
      copyFileSync(srcPath, destPath)
    } catch (err) {
      return output(
        colors.red(
          `${relativePath} could not be symlinked to ${destPath}: ${err}`,
        ),
        ready,
      )
    }
  } else if (type === 'unlink') {
    unlink(destPath, (err) => {
      if (err) {
        output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
      }
    })
  }
}
