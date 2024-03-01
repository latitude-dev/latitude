module.exports = {
  extends: [
    '@latitude-sdk/eslint-config/svelte.js',
    'plugin:storybook/recommended',
  ],
  // plugins: ['eslint-plugin-local-rules'],
  // rules: {
  //   'local-rules/check-packagejson-exports': 'error',
  // },
  overrides: [
    {
      files: ['*.json'],
      parser: 'eslint-plugin-jsonc',
    },
  ],
}
