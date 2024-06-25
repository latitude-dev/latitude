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
  external: [
    'fs',
    'ora',
    '@latitude-data/storage-driver',
    '@latitude-data/source-manager',
    'node:util',
  ],
  ...common,
}

const runQueryScript = {
  input: 'scripts/run_query/index.ts',
  output: {
    file: 'scripts/dist/run_query.js',
    format: 'esm',
    sourcemap: true,
  },
  external: [
    'node:util',
    'path',
    '@latitude-data/source-manager',
    '@latitude-data/storage-driver',
    '@latitude-data/custom_types',
    '@latitude-data/display_table',
    'fs',
  ],
  ...common,
}

const runPromptScript = {
  input: 'scripts/run_prompt/index.ts',
  output: {
    file: 'scripts/dist/run_prompt.js',
    format: 'esm',
    sourcemap: true,
  },
  external: [
    'node:util',
    'ora',
    'fs',
    'chalk',
    'cli-width',
    '@latitude-data/source-manager',
    '@latitude-data/llm-manager',
    '@latitude-data/storage-driver',
    '@latitude-data/custom_types',
  ],
  ...common,
}

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @type {RollupOptions}
 */
export default [materializeScript, runQueryScript, runPromptScript]
