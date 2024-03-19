import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  mode: 'test',
  build: {
    outDir: path.resolve(__dirname, 'dist-vscode-test'),
    lib: {
      entry: path.resolve(__dirname, 'vscode-test/src/extension.test.ts'),
      formats: ['cjs'],
      name: 'testBundle',
      fileName: () => 'extension.test.js',
    },
    rollupOptions: {
      external: ['vscode', 'path', 'fs', 'mocha'],
      output: {
        globals: {
          vscode: 'vscode',
          mocha: 'mocha',
        },
        format: 'cjs',
      },
    },
    minify: false,
  },
});
