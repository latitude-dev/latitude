<script context="module" lang="ts">
  import { type ResponsiveValue } from '@latitude-data/client'
  export type Props = {
    space: ResponsiveValue<'gap'>
    class?: string
  }
</script>

<script lang="ts">
  // TODO: Implement colapse bellow
  // Use <box> component
  import { theme } from '@latitude-data/client'
  import Box from '../box'

  type $$Props = Props

  export let space: $$Props['space'] = 'none'
  let className: $$Props['class'] = undefined
  export { className as class }

  $: classes = theme.ui.column.cssClass({ className })
</script>

<Box class={classes} gap={space}>
  <slot />
</Box>
