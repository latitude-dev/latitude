<script context="module" lang="ts">
  import { type ResponsiveBox } from '@latitude-data/client'
  export type Props = Omit<ResponsiveBox, 'className'> & {
    class?: string
    style?: string
  }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  type $$Props = Props

  export let backgroundColor: $$Props['backgroundColor'] = undefined
  export let display: $$Props['display'] = null
  export let overflow: $$Props['overflow'] = null
  export let position: $$Props['position'] = null
  export let gapY: $$Props['gapY'] = null
  export let alignX: $$Props['alignX'] = null
  export let alignY: $$Props['alignY'] = null
  export let direction: $$Props['direction'] = null
  export let marginLeft: $$Props['marginLeft'] = null
  export let paddingLeft: $$Props['paddingLeft'] = null
  export let className: $$Props['class'] = undefined
  export let style: $$Props['style'] = undefined
  export { className as class }

  $: classes = theme.ui.box.cssClasses({
    backgroundColor,
    display,
    overflow,
    position,
    gapY,
    alignX,
    alignY,
    direction,
    marginLeft,
    paddingLeft,
    className,
  })
</script>

<div class={classes} {style}>
  <slot />
</div>
