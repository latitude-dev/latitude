import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import json from '@rollup/plugin-json'
import { copy } from '@web/rollup-plugin-copy'
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

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @type {RollupOptions}
 */
export default {
  input: 'src/index.ts',
  cache: false, // This is generating stale builds in watch mode
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    copy({ patterns: 'latitude-banner.txt' }),
    typescript(),
    commonjs(),
    // The preferBuiltins option is required to resolve the built-in modules in
    // Node.js over any installed packages in node_modules directory
    resolve({
      preferBuiltins: true,
      browser: false,
      exportConditions: ['node'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.PACKAGE_VERSION': JSON.stringify(packageVersion),
      preventAssignment: true,
    }),
    json(),
  ],
  external: [
    'ajv',
    'chalk',
    'fs-extra',
    'path',
    'os',
    'util',
    'picocolors',
    'rimraf',
    'semver',
    'tar',
    'sade',
    'mri',
    'dotenv',
    'degit',
    'chokidar',
    'crypto',
    'stream',
    '@rudderstack/rudder-sdk-node',
    'configstore',
  ],
}
