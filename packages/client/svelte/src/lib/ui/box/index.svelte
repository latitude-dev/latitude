<script context="module" lang="ts">
  import { type ResponsiveBox } from '@latitude-data/client'
  export type Props = Omit<ResponsiveBox, 'className'> & {
    class?: string
  }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  type $$Props = Props

  export let backgroundColor: $$Props['backgroundColor'] = undefined
  export let display: $$Props['display'] = undefined
  export let alignX: $$Props['alignX'] = undefined
  export let alignY: $$Props['alignY'] = undefined
  export let direction: $$Props['direction'] = undefined
  export let gap: $$Props['gap'] = undefined
  export let gapY: $$Props['gapY'] = undefined
  export let gapX: $$Props['gapX'] = undefined
  export let position: $$Props['position'] = undefined
  export let margin: $$Props['margin'] = undefined
  export let marginLeft: $$Props['marginLeft'] = undefined
  export let marginRight: $$Props['marginRight'] = undefined
  export let marginTop: $$Props['marginTop'] = undefined
  export let marginBottom: $$Props['marginBottom'] = undefined
  export let padding: $$Props['padding'] = undefined
  export let paddingLeft: $$Props['paddingLeft'] = undefined
  export let paddingRight: $$Props['paddingRight'] = undefined
  export let paddingTop: $$Props['paddingTop'] = undefined
  export let paddingBottom: $$Props['paddingBottom'] = undefined
  export let className: $$Props['class'] = undefined
  export { className as class }

  $: classes = theme.ui.box.cssClasses({
    backgroundColor,
    display,
    alignX,
    alignY,
    direction,
    gap,
    gapY,
    gapX,
    position,
    margin,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    padding,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    className,
  })
</script>

<div class={classes}>
  <slot />
</div>
