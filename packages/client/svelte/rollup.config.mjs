import fs from 'fs'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import svelte from 'rollup-plugin-svelte'
import preprocess from 'svelte-preprocess'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const componentsDir = 'src/components'
const components = fs.readdirSync(componentsDir).filter(function (file) {
  return fs.statSync(path.join(componentsDir, file)).isDirectory()
})

const inputs = components.reduce((entries, folder) => {
  entries[folder] = path.join(componentsDir, folder, 'index.ts')
  return entries
}, {})

export default {
  input: inputs,
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    svelte({
      preprocess: preprocess({ typescript: true }),
    }),
    typescript(),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    terser(),
  ],
  external: (id) => {
    return Object.keys(pkg.peerDependencies).some(
      (dep) => id === dep || id.startsWith(dep + '/'),
    )
  },
}
