import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
  ],
  external: [
    'svelte/compiler',
    '@latitude-data/athena-connector',
    '@latitude-data/postgresql-connector',
    '@latitude-data/bigquery-connector',
    '@latitude-data/mysql-connector',
    '@latitude-data/snowflake-connector',
    '@latitude-data/trino-connector',
    '@latitude-data/duckdb-connector',
    '@latitude-data/sqlite-connector',
    '@latitude-data/mssql-connector',
    '@latitude-data/databricks-connector',
    'yaml',
    'fs',
    'path',
  ],
}
