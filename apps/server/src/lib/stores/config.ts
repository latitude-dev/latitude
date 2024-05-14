import { writable } from 'svelte/store'

export type LatitudeClientConfig = {
  theme?: { [key: string]: unknown }
  themeMode?: 'light' | 'dark' | 'system'
}

export type LatitudeServerConfig = {
  name: string
  version: string
} & LatitudeClientConfig

export type LatitudeConfig = LatitudeClientConfig | LatitudeServerConfig

/**
 * Filter out unnecessary config values for the client
 */
export function fliterClientConfig(
  config: LatitudeConfig,
): LatitudeClientConfig {
  return {
    theme: config.theme,
    themeMode: config.themeMode,
  }
}

// This config store is initialized and updated differently in the server and client
// - In the server, it is initialized and updated in hooks.server.ts
// - In the client, it is initialized in +layout.svelte (with the initial value from
//   the server passed from +layout.server.ts) and updated in hooks.client.ts via
//   the configWatcher plugin
export const config = writable<LatitudeConfig>({})
