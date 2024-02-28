import typescript from '@rollup/plugin-typescript'
export default {
  input: 'src/index.ts',
  output: [{ file: 'dist/index.js', sourcemap: true }],
  external: [
    '@latitude-sdk/query_result',
    'fs',
    'path',
    '@latitude-sdk/sql-compiler',
  ],
  plugins: [
    typescript({
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
  ],
}
