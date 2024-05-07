import typescript from '@rollup/plugin-typescript'

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
  ],
  external: [
    'yaml',
    'fs',
    'path',
    'dotenv/config',
    '@latitude-data/sql-compiler',
    '@latitude-data/query_result',
  ],
}
