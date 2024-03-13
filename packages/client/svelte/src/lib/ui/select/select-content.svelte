<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui'
  import { theme } from '@latitude-data/client'
  import { flyAndScale } from '$lib/utils'
  import { scale } from 'svelte/transition'

  type $$Props = SelectPrimitive.ContentProps

  let className: $$Props['class'] = undefined
  export let sideOffset: $$Props['sideOffset'] = 4
  export let inTransition: $$Props['inTransition'] = flyAndScale
  export let inTransitionConfig: $$Props['inTransitionConfig'] = undefined
  export let outTransition: $$Props['outTransition'] = scale
  export let outTransitionConfig: $$Props['outTransitionConfig'] = {
    start: 0.95,
    opacity: 0,
    duration: 50,
  }
  export { className as class }
</script>

<SelectPrimitive.Content
  {inTransition}
  {inTransitionConfig}
  {outTransition}
  {outTransitionConfig}
  {sideOffset}
  class={theme.ui.select.content.cssClass({ className })}
  {...$$restProps}
>
  <div class={theme.ui.select.content.CONTAINER_CSS_CLASS}>
    <slot />
  </div>
</SelectPrimitive.Content>
