<script lang="ts">
  import { theme, type TextProps } from '@latitude-data/client'

  type $$Props = TextProps

  export let align: $$Props['align'] = 'left'
  export let as: $$Props['as'] = 'span'
  export let capitalize: $$Props['capitalize'] = false
  export let centered: $$Props['centered'] = false
  export let color: $$Props['color'] = 'foreground'
  export let ellipsis: $$Props['ellipsis'] = false
  export let leading: $$Props['leading'] = 'h4'
  export let lineThrough: $$Props['lineThrough'] = false
  export let size: $$Props['size'] = 'h4'
  export let spacing: $$Props['spacing'] = 'normal'
  export let underline: $$Props['underline'] = false
  export let uppercase: $$Props['uppercase'] = false
  export let weight: $$Props['weight'] = 'normal'
  export let whiteSpace: $$Props['whiteSpace'] = 'normal'
  export let wordBreak: $$Props['wordBreak'] = 'normal'

  $: classes = theme.ui.text.cssClass({
    align,
    capitalize,
    centered,
    color,
    ellipsis,
    lineThrough,
    spacing,
    size,
    leading,
    underline,
    uppercase,
    weight,
    whiteSpace,
    wordBreak,
  })
</script>

<svelte:element this={as} class={classes}>
  <slot />
</svelte:element>
