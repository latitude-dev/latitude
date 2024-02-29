import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import autoImport from 'sveltekit-autoimport'

export default defineConfig({
  plugins: [
    autoImport({
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
