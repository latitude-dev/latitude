import typescript from '@rollup/plugin-typescript'

const common = {
  plugins: [
    typescript({ tsconfig: './tsconfig.scripts.json', sourceMap: true }),
  ],
}

const materializeScript = {
  input: 'scripts/materialize_queries/index.ts',
  output: {
    file: 'scripts/dist/materialize_queries.js',
    format: 'esm',
    sourcemap: true,
  },
  external: ['fs', 'ora', '@latitude-data/source-manager', 'node:util'],
  ...common,
}

const runScript = {
  input: 'scripts/run_query/index.ts',
  output: {
    file: 'scripts/dist/run_query.js',
    format: 'esm',
    sourcemap: true,
  },
  external: [
    '@latitude-data/display_table',
    'node:util',
    'path',
    '@latitude-data/source-manager',
    '@latitude-data/custom_types',
    'fs',
  ],
  ...common,
}

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @type {RollupOptions}
 */
export default [materializeScript, runScript]
