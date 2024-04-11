import typescript from '@rollup/plugin-typescript'

const EXTERNAL_DEPENDENCIES = [
  '@latitude-data/client',
  '@latitude-data/query_result',
  '@latitude-data/embedding',
  '@latitude-data/webcomponents/dist/components/latitude-embed.js',
  '@tanstack/react-query',
  'react/jsx-runtime',
  'react-dom',
  'react'
]

export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [typescript()],
  },
]
