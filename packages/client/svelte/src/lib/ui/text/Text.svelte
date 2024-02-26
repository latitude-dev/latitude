<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import type {
    Color,
    Size,
    Spacing,
    Weight,
    WhiteSpace,
    WordBreak,
  } from '@latitude-sdk/client/src/theme/ui/text'

  export let capitalize = false
  export let centered = false
  export let color: Color = 'foreground'
  export let ellipsis = false
  export let lineThrough = false
  export let size: Size
  export let underline = false
  export let uppercase = false
  export let spacing: Spacing
  export let weight: Weight
  export let whiteSpace: WhiteSpace
  export let wordBreak: WordBreak

  $: classes = theme.ui.text.cssClass({
    capitalize,
    centered,
    color,
    ellipsis,
    lineThrough,
    spacing,
    size,
    underline,
    uppercase,
    weight,
    whiteSpace,
    wordBreak,
  })
</script>

<span class={classes}>
  <slot />
</span>
