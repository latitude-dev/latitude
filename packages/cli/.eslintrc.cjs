/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: ['@latitude-data/eslint-config/library.js'],
  ignorePatterns: ['node_modules/', 'dist'],
  globals: {
    "NodeJS": true
  },
}
