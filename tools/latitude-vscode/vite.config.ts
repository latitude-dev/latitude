import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/extension.ts'),
      name: 'latitude-vscode',
      fileName: () => 'extension.js',
    },
    rollupOptions: {
      external: ['vscode', 'path', 'fs', 'child_process'],
      output: {
        globals: {
          vscode: 'vscode',
        },
        format: 'cjs',
      },
    },
    minify: process.env.NODE_ENV === 'production',
  },
});
