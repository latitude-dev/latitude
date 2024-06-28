import * as path from 'path'
import * as url from 'url'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const aliasEntries = {
  entries: [{ find: '$', replacement: path.resolve(__dirname, 'src') }],
}

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
      },
    ],
    plugins: [
      typescript({
        noEmit: true,
        tsconfig: './tsconfig.json',
        exclude: ['**/__tests__', '**/*.test.ts'],
      }),
    ],
    external: [
      'fs',
      'path',
      'yaml',
      'openai',
      '@latitude-data/source-manager',
      '@latitude-data/sql-compiler',
      'dotenv/config',
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [alias(aliasEntries), dts()],
  },
]
