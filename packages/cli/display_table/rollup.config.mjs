import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      sourcemap: true,
      globals: {
        react: 'React',
      },
    },
  ],
  plugins: [
    typescript()
  ],
  external: [
    'react',
    'ink',
    'ink-spinner',
    'chokidar',
    '@latitude-data/source-manager',
    '@latitude-data/query_result',
    '@latitude-data/sql-compiler',
  ]
};
