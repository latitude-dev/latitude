const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'turbo'],
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es2022: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    '.*.cjs',
    'node_modules/',
    'dist/',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}
