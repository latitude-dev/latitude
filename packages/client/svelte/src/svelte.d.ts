// This file tells TypeScript that anything imported from a .svelte file is a valid Svelte component type.
declare module '*.svelte' {
  import type { SvelteComponent } from 'svelte'
  const component: SvelteComponent
  export default component
}
