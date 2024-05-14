import typescript from '@rollup/plugin-typescript'

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @type {RollupOptions}
 */
export default {
  input: 'scripts/materialize_queries/index.ts',
  output: {
    file: 'scripts/dist/materialize_queries.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.scripts.json', sourceMap: true }),
  ],
  external: ['fs', 'ora', '@latitude-data/source-manager', 'node:util'],
}
