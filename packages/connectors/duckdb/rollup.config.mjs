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
    'path',
    '@latitude-data/sql-compiler',
    '@latitude-data/source-manager',
    '@latitude-data/query_result',
    'duckdb-async',
  ],
}
