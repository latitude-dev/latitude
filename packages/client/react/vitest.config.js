import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      $src: resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})

