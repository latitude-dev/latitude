import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import autoImport from 'sveltekit-autoimport'

export default defineConfig({
  plugins: [
    autoImport({
      mapping: {
        Button: 'import Button from "@latitude-sdk/svelte/button"',
        Card: 'import * as Card from "@latitude-sdk/svelte/card"',
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
