import path from 'path'
import { type HmrContext } from 'vite'
import fs from 'fs'

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'config-update': { [key: string]: unknown }
  }
}

export default function watchQueriesPlugin() {
  const configPath = path.resolve(
    __dirname,
    '../static/.latitude/latitude.json',
  )
  return {
    name: 'latitude-json-watcher',
    enforce: 'post',
    handleHotUpdate({ file, server }: HmrContext) {
      if (server.config.mode !== 'development') return

      if (file === configPath) {
        try {
          const newConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
          // This update will only be sent to the client, not the server. This means
          // we need to filter out any config values that are not needed on the client
          // side for security reasons (even though this is only done in dev mode).
          const clientConfig = {
            theme: newConfig.theme,
            themeMode: newConfig.themeMode,
          }
          server.ws.send({
            type: 'custom',
            event: 'client-config-update', // Handled in hooks.client.ts
            data: clientConfig,
          })
        } catch (error) {
          throw new Error(`Failed to read and parse latitude.json\n${error}`)
        }
      }
    },
  }
}
