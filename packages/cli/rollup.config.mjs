import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/cli.ts',
  output: {
    file: 'dist/cli.cjs.js',
    format: 'cjs',
  },
  plugins: [typescript(), commonjs(), resolve()],
}
