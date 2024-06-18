import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

// eslint-disable-next-line
// @ts-ignore
import autoImport from '@latitude-data/sveltekit-autoimport'
import latitudePlugin from './plugins/latitude'
import watchQueries from './plugins/queriesWatcher'
import watchLatitudeJson from './plugins/configWatcher'

export default defineConfig({
  plugins: [
    latitudePlugin(),
    watchQueries(),
    watchLatitudeJson(),
    autoImport({
      module: {
        '@latitude-data/svelte': [
          'Alert',
          'Button',
          'Card',
          'Row',
          'Column',
          'View',
          'Text',
          'Link',
        ],
      },
      mapping: {
        runQuery: 'import { runQuery } from "$lib/stores/queries"',
        param: 'import { useViewParam as param } from "$lib/stores/viewParams"',
        input: 'import { input } from "$lib/stores/queries"',
      },
      components: [{ name: './src/lib/autoimports', flat: true }],
    }),
    sveltekit(),
  ],
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: [
      '@latitude-data/client',
      '@latitude-data/svelte',
      '@latitude-data/embedding',
    ],
  },
  build: {
    rollupOptions: {
      external: ['@latitude-data/source-manager', 'path', 'child_process'],
    },
  },
})
