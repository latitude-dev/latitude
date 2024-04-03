import typescript from '@rollup/plugin-typescript'

const EXTERNAL_DEPENDENCIES = [
  '@latitude-data/client',
  '@latitude-data/query_result',
  '@tanstack/react-query',
]

export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [
      typescript()
    ],
  },
]
