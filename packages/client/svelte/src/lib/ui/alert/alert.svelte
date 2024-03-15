<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { theme } from '@latitude-data/client'

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    variant?: theme.ui.alert.Variant
  }

  let className: $$Props['class'] = undefined
  export let variant: $$Props['variant'] = 'default'
  export { className as class }
</script>

<div
  class={theme.ui.alert.root.cssClass({ variant, className })}
  {...$$restProps}
  role="alert"
>
  <p>
    <slot />
  </p>
</div>
