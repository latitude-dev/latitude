import colors from 'picocolors'
import fs from 'fs'
import path from 'path'
import output from '../../output'

type Strategy = 'copy' | 'symlink'

export default function syncFiles({
  srcPath,
  relativePath,
  destPath,
  type,
  ready,
  strategy = 'copy',
  silent = false,
}: {
  srcPath: string
  relativePath: string
  destPath: string
  type: 'add' | 'change' | 'unlink'
  ready: boolean
  strategy?: Strategy
  silent?: boolean
}) {
  if (type === 'add' || type === 'change') {
    // Make sure all directories in the path exist
    fs.mkdirSync(path.dirname(destPath), { recursive: true })

    const onError = (err: unknown) => {
      if (err) {
        if (silent) return
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

    if (silent) return
    console.log(`${colors.blue(relativePath)} ${colors.green(`was ${type}ed`)}`)
  } else if (type === 'unlink') {
    fs.unlink(destPath, (err) => {
      if (err) {
        if (silent) return
        output(colors.red(`${destPath} could not be deleted: ${err}`), ready)
      }
    })
  }
}
