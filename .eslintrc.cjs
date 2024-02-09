/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@latitude-dev/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['apps/**', 'packages/**', 'tools/**', 'sites/**'],
  parserOptions: {
    project: true,
  },
}
