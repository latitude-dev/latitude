import colors from 'picocolors'
import chokidar from 'chokidar'

type EventType = 'add' | 'change' | 'unlink'
const EVENT_VERB: Record<EventType, string> = {
  add: 'added',
  change: 'changed',
  unlink: 'removed',
}

function logEvent(event: EventType, path: string) {
  console.log(
    colors.blue(`${path} has been ${colors.green(EVENT_VERB[event])}`),
  )
}

type SyncFileFn = (srcPath: string, type: EventType, ready: boolean) => void
type WatcherOptions = {
  ignored?: RegExp | string | ((path: string) => boolean)
  persistent?: boolean
  debug?: boolean
}
export default function watcher(
  dir: string,
  syncFile: SyncFileFn,
  { ignored, persistent = true, debug = false }: WatcherOptions = {
    persistent: true,
    debug: false,
  },
): Promise<void> {
  return new Promise((resolve, reject) => {
    let ready = false
    const watcher = chokidar.watch(dir, { ignored, persistent })

    // Event listeners.
    watcher
      .on('add', (path: string) => {
        if (debug) {
          logEvent('add', path)
        }
        syncFile(path, 'add', ready)
      })
      .on('change', (path: string) => {
        if (debug) {
          logEvent('change', path)
        }
        syncFile(path, 'change', ready)
      })
      .on('unlink', (path: string) => {
        if (debug) {
          logEvent('unlink', path)
        }
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
