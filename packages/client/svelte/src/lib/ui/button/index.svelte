<script context="module" lang="ts">
  export type Props = Omit<ButtonPrimitive.Props, 'class'> & {
    variant?: theme.ui.button.Variant
    size?: theme.ui.button.Size
    class?: string | null | undefined
    ellipsis?: boolean
  }
</script>

<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui'
  import { theme } from '@latitude-data/client'

  let className: Props['class'] = undefined

  export let variant: Props['variant'] = 'default'
  export let size: Props['size'] = 'default'
  export let ellipsis: Props['ellipsis'] = false
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
  <div class={theme.ui.button.textClass({ ellipsis })}><slot /></div>
  <!-- TODO: review margin. And move what we have in Combobox.trigger to here -->
  <slot name="icon" />
</ButtonPrimitive.Root>
