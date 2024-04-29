import preset from '@latitude-data/client/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-data/client/src/theme/ui/**/*.ts',
  ],
}
