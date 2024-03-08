import { dts } from 'rollup-plugin-dts'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

const EXTERNAL_DEPENDENCIES = [
  '@latitude-data/custom_types',
  '@latitude-data/query_result',
  'clsx',
  'date-fns/format',
  'lodash-es',
  'tailwind-merge',
  'tailwind-variants',
  'zustand',
  'zustand/vanilla',
]

/** @type {import('rollup').RollupOptions}*/
export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [
      typescript(),
      copy({
        targets: [
          {
            src: 'src/theme/assets/latitude.css',
            dest: 'dist',
          },
        ],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [dts()],
  },
]
