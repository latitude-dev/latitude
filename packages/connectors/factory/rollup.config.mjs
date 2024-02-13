import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    }
  ],
  plugins: [typescript({
    exclude: ["**/__tests__", "**/*.test.ts"]
  })],
  external: ['svelte/compiler', '@latitude-dev/postgresql-connector', 'yaml', 'fs', 'path'],
}
