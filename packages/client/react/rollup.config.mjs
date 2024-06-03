import typescript from '@rollup/plugin-typescript'

const EXTERNAL_DEPENDENCIES = [
  '@latitude-data/client',
  '@latitude-data/query_result',
  '@latitude-data/embedding',
  '@latitude-data/webcomponents/dist/loader',
  '@latitude-data/webcomponents/dist/components/latitude-embed.js',
  '@tanstack/react-query',
  'react/jsx-runtime',
  'react-dom',
  'react',
  '@radix-ui/react-popover',
  '@radix-ui/react-slot',
  '@radix-ui/react-label',
  'react-table',
  'use-prefers-color-scheme',
  'lodash-es',
  'echarts/core',
  'echarts/renderers',
  'echarts/components',
  'echarts/charts',
  'echarts/charts',
]

export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [typescript()],
  },
]
