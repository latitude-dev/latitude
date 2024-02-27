import { dts } from 'rollup-plugin-dts'
import typescript from '@rollup/plugin-typescript'

const EXTERNAL_DEPENDENCIES = [
  'clsx',
  'tailwind-merge',
  'tailwind-variants',
  'zustand',
  'zustand/vanilla',
  'lodash/flatten',
  'lodash/compact',
  'lodash/format',
  'lodash/isString',
  'lodash/isNaN',
  'date-fns/format',
  '@latitude-sdk/query_result',
]

/** @type {import('rollup').RollupOptions}*/
export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [typescript()],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [dts()],
  },
]
