import { defineConfig } from 'vite'
import nodeResolver from '@rollup/plugin-node-resolve'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/*/**.ts',
      formats: ['es'],
    },
    minify: true,
    rollupOptions: {
      plugins: [
        nodeResolver({
          exportConditions: ['node'],
          preferBuiltins: false,
        }),
      ],
      external: ['url', 'path', 'fs', 'fs/promises'], // Mark Node.js built-ins as external
      input: 'src/cli.ts',
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
