// vitest.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import { string } from 'rollup-plugin-string'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    string({
      include: '**/*.template',
    }),
  ],
})
