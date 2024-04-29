import coreConfig from '@latitude-data/client/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [coreConfig],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@latitude-data/client/src/theme/ui/**/*.ts',
  ],
}
