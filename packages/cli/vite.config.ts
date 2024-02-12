import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/*/**.ts',
      formats: ['es'],
    },
    minify: true,
    rollupOptions: {
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
