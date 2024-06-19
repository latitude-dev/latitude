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
    '@aws-sdk/client-s3',
    '@aws-sdk/lib-storage',
    'stream',
    'path',
  ],
}
