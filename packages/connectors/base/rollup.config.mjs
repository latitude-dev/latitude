import typescript from '@rollup/plugin-typescript'
export default {
  input: 'src/index.ts',
  output: [{ file: 'dist/index.js', sourcemap: true }],
  external: [
    '@latitude-data/query_result',
    'fs',
    'path',
    '@latitude-data/sql-compiler',
  ],
  plugins: [
    typescript({
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
  ],
}
