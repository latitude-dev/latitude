import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
// eslint-disable-next-line
// @ts-ignore
import autoImport from 'sveltekit-autoimport'
import latitudePlugin from './plugins/latitude'

export default defineConfig({
  plugins: [
    latitudePlugin(),
    autoImport({
      module: { '@latitude-data/client/svelte': ['Button', 'Card', 'Row', 'Column'] },
      mapping: {
        runQuery: 'import { runQuery } from "$lib/stores/queries"',
        input: 'import { input } from "$lib/stores/queries"'
      },
      components: [{ name: './src/lib/autoimports', flat: true }],
    }),
    sveltekit(),
  ],
  ssr: {
    noExternal: ['@latitude-data/client', '@latitude-data/svelte'],
  },
  build: {
    rollupOptions: {
      external: ['@latitude-data/connector-factory'],
    },
  },
})
