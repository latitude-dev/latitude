import colors from 'picocolors'

const chokidar = require('chokidar')

export default function watcher(
  dir: string,
  syncFile: (
    srcPath: string,
    type: 'add' | 'change' | 'unlink',
    ready: boolean,
  ) => void,
  opts: {
    ignored?: RegExp
    persistent?: boolean
  },
): Promise<void> {
  return new Promise((resolve, reject) => {
    let ready = false
    const watcher = chokidar.watch(dir, opts)

    // Event listeners.
    watcher
      .on('add', (path: string) => {
        syncFile(path, 'add', ready)
      })
      .on('change', (path: string) => {
        syncFile(path, 'change', ready)
      })
      .on('unlink', (path: string) => {
        syncFile(path, 'unlink', ready)
      })
      .on('error', (error: Error) => {
        console.error(colors.red(`Watcher error: ${error}`))

        reject()
      })
      .on('ready', () => {
        setTimeout(() => {
          // Wait for the initial sync to complete
          ready = true
        }, 1000)

        resolve()
      })
  })
}
