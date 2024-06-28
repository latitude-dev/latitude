import typescript from '@rollup/plugin-typescript'
import * as path from 'path'
import * as url from 'url'
import alias from '@rollup/plugin-alias'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const aliasEntries = {
  entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
        exclude: ['**/__tests__', '**/*.test.ts', '**/*.d.ts'],
      }),
      commonjs(),
    ],
    external: [
      'yaml',
      'fs',
      'path',
      'crypto',
      'stream',
      'uuid',
      'dotenv/config',
      '@latitude-data/sql-compiler',
      '@latitude-data/query_result',
      '@latitude-data/storage-driver',
      '@dsnp/parquetjs',
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [alias(aliasEntries), dts()],
  },
]
