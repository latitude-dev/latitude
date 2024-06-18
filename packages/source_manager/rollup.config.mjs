import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
        exclude: ['**/__tests__', '**/*.test.ts', '**/*.d.ts'],
      }),
      commonjs(),
    ],
    external: [
      'yaml',
      'fs',
      'path',
      'crypto',
      'dotenv/config',
      '@latitude-data/sql-compiler',
      '@latitude-data/query_result',
      '@dsnp/parquetjs',
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      alias({
        entries: [{ find: '@', replacement: './src/' }],
      }),
      dts(),
    ],
    external: (id) => id.startsWith('@'),
  },
]
