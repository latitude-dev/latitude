import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
  },
  plugins: [typescript({
    exclude: ["**/__tests__", "**/*.test.ts"]
  })]
}
