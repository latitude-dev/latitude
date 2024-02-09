import { defineConfig } from 'vite'
import { resolve } from 'path'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'tailwind',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['tailwindcss'],
    },
  },
  plugins: [dtsPlugin()],
})
