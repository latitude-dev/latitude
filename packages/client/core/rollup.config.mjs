import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const EXTERNAL_DEPENDENCIES = ['clsx', 'tailwind-merge', 'tailwind-variants']

/** @type {import('rollup').RollupOptions}*/
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  external: EXTERNAL_DEPENDENCIES,
  plugins: [
    typescript({ exclude: ['**/*.test.ts'] }),
    terser(), // Minify JS
  ],
}
