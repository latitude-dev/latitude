<script context="module" lang="ts">
  export type Props = HTMLAttributes<HTMLDivElement> & theme.ui.alert.Props
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLDivElement> & theme.ui.alert.Props

  let className: $$Props['class'] = undefined
  export let variant: $$Props['variant'] = 'default'
  export let scrollable: $$Props['scrollable'] = false
  export { className as class }
</script>

<div
  class={theme.ui.alert.root.cssClass({ variant, scrollable, className })}
  {...$$restProps}
  role="alert"
>
  <slot />
</div>
