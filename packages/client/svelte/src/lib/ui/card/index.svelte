<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { theme } from '@latitude-data/client'

  export type Props = HTMLAttributes<HTMLDivElement> & theme.ui.card.CardProps
</script>

<script lang="ts">
  type $$Props = Props
  let className: $$Props['class'] = undefined
  export let type: $$Props['type'] = 'normal'

  export { className as class }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={theme.ui.card.rootCssClass({ type, className })}
  {...$$restProps}
  on:click
  on:focusin
  on:focusout
  on:mouseenter
  on:mouseleave
>
  <slot />
</div>
