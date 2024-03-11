<script context="module" lang="ts">
  import type { Action } from 'svelte/action'
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  export type Props = HTMLAttributes<HTMLDivElement> &
    theme.ui.card.CardProps & {
      action?: Action | undefined
    }
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  let ref: HTMLElement
  type $$Props = Props
  let className: $$Props['class'] = undefined
  export let action: $$Props['action'] = undefined
  export let type: $$Props['type'] = 'normal'

  export { className as class }
  onMount(() => {
    if (!action) return

    action(ref)
  })
</script>

<div
  bind:this={ref}
  class={theme.ui.card.headerCssClass({ type, className })}
  {...$$restProps}
>
  <slot />
</div>
