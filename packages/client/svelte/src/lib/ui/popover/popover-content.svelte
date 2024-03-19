<script lang="ts">
  import { Popover as PopoverPrimitive } from 'bits-ui'
  import { theme } from '@latitude-data/client'
  import { flyAndScale } from '$lib/utils'

  type $$Props = PopoverPrimitive.ContentProps

  let className: $$Props['class'] = undefined
  export let transition: $$Props['transition'] = flyAndScale
  export let transitionConfig: $$Props['transitionConfig'] = undefined
  export let align: $$Props['align'] = 'center'
  export let sideOffset: $$Props['sideOffset'] = 4
  export { className as class }
</script>

<PopoverPrimitive.Content
  {transition}
  {transitionConfig}
  {align}
  {sideOffset}
  {...$$restProps}
  class={theme.ui.popover.cssClass({ className })}
>
  <slot />
</PopoverPrimitive.Content>
