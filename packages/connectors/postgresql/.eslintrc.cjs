/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@latitude-sdk/sdk/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
}
