import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

function getPackageVersion() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const pkgPath = path.join(__dirname, 'package.json')
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version
}

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const packageVersion =
  nodeEnv === 'development' ? 'development-0.0.0' : getPackageVersion()

export default {
  input: 'src/cli.ts',
  output: {
    file: 'dist/cli.cjs.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    commonjs(),
    // The preferBuiltins option is required to resolve the built-in modules in
    // Node.js over any installed packages in node_modules directory
    resolve({ preferBuiltins: true }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.PACKAGE_VERSION': JSON.stringify(packageVersion),
      preventAssignment: true,
    }),
  ],
}
