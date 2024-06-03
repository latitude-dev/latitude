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
    try {
      // Make sure all directories in the path exist
      mkdirSync(path.dirname(destPath), { recursive: true })
    } catch (err) {
      return output(
        colors.red(
          `${path.dirname(destPath)} could not be created: ${
            (err as Error).message
          }`,
        ),
        ready,
      )
    }

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
