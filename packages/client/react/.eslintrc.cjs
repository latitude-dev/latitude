/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@latitude-data/eslint-config/library.js',
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "react/prop-types": "off"
  },
  env: {
    "browser": true,
  }
}
