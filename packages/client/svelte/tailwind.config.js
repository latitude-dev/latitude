import preset from '@latitude-sdk/client/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-sdk/client/src/theme/ui/**/*.ts',
  ],
}
