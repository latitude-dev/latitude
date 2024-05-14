import configureShutdown from '$lib/server/shutdown'
import { Handle } from '@sveltejs/kit'
import { APP_CONFIG_PATH } from '$lib/constants'
import fs from 'fs'
import { get } from 'svelte/store'
import { config, LatitudeServerConfig } from '$lib/stores/config'

const isDevMode = import.meta.env.MODE === 'development'

function updateConfig({ fallback }: { fallback: LatitudeServerConfig }) {
  try {
    const newConfig = JSON.parse(fs.readFileSync(APP_CONFIG_PATH, 'utf-8'))
    config.set(newConfig)
  } catch (error) {
    console.error('Failed to read and parse latitude.json:', error)
    config.set(fallback)
  }
}

async function watchConfig() {
  const chokidar = await import('chokidar')
  const configWatcher = chokidar.watch(APP_CONFIG_PATH)
  configWatcher.on('change', () => {
    const currentConfig = get(config)
    updateConfig({ fallback: currentConfig as LatitudeServerConfig })
  })
}

updateConfig({ fallback: {} as LatitudeServerConfig })
if (isDevMode) watchConfig()

configureShutdown()

// TODO: Implement CORS origin property in `latitude.json` and use it here
// this way users are able to configure what domains are allowed to pull data from
// Latitude server
const CORS = {
  origin: {
    name: 'Access-Control-Allow-Origin',
    value: '*',
  },
  methods: {
    name: 'Access-Control-Allow-Methods',
    value: 'GET, OPTIONS',
  },
  headers: {
    name: 'Access-Control-Allow-Headers',
    value: '*',
  },
}
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)

  if (event.request.method.toUpperCase() === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        [CORS.origin.name]: CORS.origin.value,
        [CORS.methods.name]: CORS.methods.value,
        [CORS.headers.name]: CORS.headers.value,
      },
    })
  }

  response.headers.set(CORS.origin.name, CORS.origin.value)
  response.headers.set(CORS.methods.name, CORS.methods.value)
  response.headers.set(CORS.headers.name, CORS.headers.value)

  return response
}
