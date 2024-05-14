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
    '@latitude-data/source-manager',
    '@latitude-data/query_result',
    '@aws-sdk/client-athena',
    'crypto',
  ],
}
