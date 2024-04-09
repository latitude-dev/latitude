import configureShutdown from '$lib/server/shutdown'
import { Handle } from '@sveltejs/kit'

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
