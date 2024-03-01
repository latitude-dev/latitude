import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
// eslint-disable-next-line
// @ts-ignore
import autoImport from 'sveltekit-autoimport'
import latitudePlugin from './plugins/latitude.mjs'

export default defineConfig({
  plugins: [
    latitudePlugin(),
    autoImport({
      mapping: {
        runQuery: 'import { runQuery } from "$lib/stores/queries"',
        input: 'import { input } from "$lib/stores/queries"',
      },
      module: {
        '@latitude-sdk/client/svelte': ['Button', 'Card'],
      },
    }),
    sveltekit(),
  ],
  ssr: {
    noExternal: ['@latitude-sdk/client', '@latitude-sdk/svelte'],
  },
  build: {
    rollupOptions: {
      external: ['@latitude-sdk/connector-factory'],
    },
  },
})
