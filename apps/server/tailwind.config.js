import preset from '@latitude-sdk/svelte/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-sdk/svelte/src/lib/components/ui/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
