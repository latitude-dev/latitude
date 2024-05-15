import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
    commonjs()
  ],
  external: [
    'yaml',
    'fs',
    'path',
    'crypto',
    'dotenv/config',
    '@latitude-data/sql-compiler',
    '@latitude-data/query_result',
    '@dsnp/parquetjs',
  ],
}
