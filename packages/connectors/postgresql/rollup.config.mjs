import commonjs from '@rollup/plugin-commonjs'
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
    commonjs(),
    typescript({
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
  ],
  external: [
    '@latitude-data/base-connector',
    '@latitude-data/query_result',
    'pg',
    'fs',
  ],
}
