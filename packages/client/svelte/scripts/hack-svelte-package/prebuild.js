import fs from 'fs'

const packageJsonPath = './package.json'
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

const buildExports = {
  './tailwind.preset': './tailwind.config.js',
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js',
  },
  './*': {
    types: './dist/ui/*/index.d.ts',
    svelte: './dist/ui/*/index.js',
  },
}
packageJson.exports = buildExports

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
