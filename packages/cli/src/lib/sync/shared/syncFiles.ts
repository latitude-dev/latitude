import colors from 'picocolors'
import output from '../../output'
import path from 'path'
import { copyFile, mkdirSync, symlink, unlink } from 'fs'

type Strategy = 'copy' | 'symlink'

export default function syncFiles({
  srcPath,
  relativePath,
  destPath,
  type,
  ready,
  strategy = 'copy',
}: {
  srcPath: string
  relativePath: string
  destPath: string
  type: 'add' | 'change' | 'unlink'
  ready: boolean
  strategy?: Strategy
}) {
  if (type === 'add' || type === 'change') {
    // Make sure all directories in the path exist
    mkdirSync(path.dirname(destPath), { recursive: true })

    const onError = (err: unknown) => {
      if (err) {
        return output(
          colors.red(
            `${relativePath} could not be symlinked to ${destPath}: ${err}`,
          ),
          ready,
        )
      }
    }

    if (strategy === 'symlink') {
      symlink(srcPath, destPath, 'file', onError)
    } else {
      copyFile(srcPath, destPath, onError)
    }
  } else if (type === 'unlink') {
    unlink(destPath, (err) => {
      if (err) {
        output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
      }
    })
  }
}
