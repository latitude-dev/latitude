import preset from '@latitude-sdk/svelte/tailwind.preset'
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-sdk/client/src/theme/ui/**/*.ts',
    './node_modules/@latitude-sdk/svelte/src/**/*.{html,js,svelte,ts}',
  ],
}
