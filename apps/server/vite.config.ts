import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import autoImport from 'sveltekit-autoimport'
import latitudePlugin from './plugins/latitude'

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
    noExternal: ['@latitude-sdk/client'],
  },
  build: {
    rollupOptions: {
      external: ['@latitude-sdk/connector-factory'],
    },
  },
})
