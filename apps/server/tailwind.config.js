import preset from '@latitude-data/svelte/tailwind.preset'
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-data/client/dist/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-data/svelte/dist/**/*.{html,js,svelte,ts}',
  ],
}
