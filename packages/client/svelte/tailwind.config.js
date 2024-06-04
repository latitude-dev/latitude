import coreConfig, { theme } from '@latitude-data/client/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [coreConfig],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-data/client/src/theme/ui/**/*.ts',
    './node_modules/@latitude-data/dist/responsiveClasses.txt',
  ],
}

export { theme }
