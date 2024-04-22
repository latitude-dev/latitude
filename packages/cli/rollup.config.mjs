import { fileURLToPath } from 'url'
import fs from 'fs'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { dirname, resolve as resolvePath } from 'path'
import json from '@rollup/plugin-json'
import { copy } from '@web/rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const DIRNAME = dirname(fileURLToPath(import.meta.url))
function getPackageVersion() {
  const pkgPath = path.join(DIRNAME, 'package.json')
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version
}

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const packageVersion =
  nodeEnv === 'development' ? 'development-0.0.0' : getPackageVersion()

const workspaceDotEnvPath = resolvePath(DIRNAME, '..', '..', '.env')
dotenvConfig({ path: workspaceDotEnvPath })

/**
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @type {RollupOptions}
 */
export default {
  input: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  cache: false, // This is generating stale builds in watch mode
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
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
      'process.env.CLI_SENTRY_ENABLED': JSON.stringify(process.env.CLI_SENTRY_ENABLED),
      'process.env.CLI_SENTRY_DSN': JSON.stringify(process.env.CLI_SENTRY_DSN),
      'process.env.TELEMETRY_URL': JSON.stringify(process.env.TELEMETRY_URL),
      'process.env.TELEMETRY_CLIENT_KEY': JSON.stringify(process.env.TELEMETRY_CLIENT_KEY),
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
    'latest-version',
    '@sentry/node',
    '@sentry/profiling-node',
    '@latitude-data/connector-factory',
  ],
}
