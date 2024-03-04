<script context="module" lang="ts">
  export type Props = Omit<ButtonPrimitive.Props, 'class'> & {
    variant?: theme.ui.button.Variant
    size?: theme.ui.button.Size
    class?: string | null | undefined
  }
</script>

<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui'
  import { theme } from '@latitude-data/client'

  let className: Props['class'] = undefined

  export let variant: Props['variant'] = 'default'
  export let size: Props['size'] = 'default'
  export let builders: Props['builders'] = []
  export { className as class }
</script>

<ButtonPrimitive.Root
  {builders}
  type="button"
  class={theme.ui.button.cssClass({ variant, size, className })}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
