import colors from 'picocolors'
import output from './output'
import fs from 'fs'
import path from 'path'

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
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

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
      fs.symlink(srcPath, destPath, 'file', onError)
    } else {
      fs.copyFile(srcPath, destPath, onError)
    }
  } else if (type === 'unlink') {
    fs.unlink(destPath, (err) => {
      if (err) {
        output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
      }
    })
  }
}
