import path from 'path'
import { type HmrContext } from 'vite'

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'refetch-queries': { queries: string[] }
  }
}

export default function watchQueriesPlugin() {
  const queriesPath = path.resolve(__dirname, '../static/latitude/queries')
  return {
    name: 'latitude-queries-watcher',
    enforce: 'post',
    handleHotUpdate({ file, server }: HmrContext) {
      if (file.endsWith('.sql')) {
        const relativePath = path.relative(queriesPath, file)
        server.ws.send({
          type: 'custom',
          event: 'refetch-queries',
          data: {
            queries: [relativePath.replace(/\.sql$/, '')],
          },
        })
      }
    },
  }
}
