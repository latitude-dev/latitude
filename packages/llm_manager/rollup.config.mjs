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
    })
  ],
  external: [
    'fs',
    'path',
    'yaml',
    'openai',
    '@latitude-data/source-manager',
    '@latitude-data/sql-compiler',
    'dotenv/config',
  ],
}
