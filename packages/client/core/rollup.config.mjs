import fs from 'fs'
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

/** @type {import('rollup').RollupOptions} */
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
    input: 'src/responsive/properties/index.ts',
    output: [{ file: 'dist/responsiveClasses.js' }],
    plugins: [typescript()],
  },
  {
    input: 'dist/responsiveClasses.js',
    output: [{ file: 'dist/responsiveClasses.txt' }],
    plugins: [
      {
        name: 'latitude-responsive-classes',
        async writeBundle({ file: output }, bundle) {
          const input = Object.values(bundle)[0].facadeModuleId
          const result = await import(`${input}?update=${Date.now()}`)
          fs.writeFileSync(output, result.default(), { flag: 'w' })
        },
      },
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external: EXTERNAL_DEPENDENCIES,
    plugins: [dts()],
  },
]
