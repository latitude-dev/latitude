<script context="module" lang="ts">
  import type { ResponsiveValue } from '@latitude-data/client'

  export type Props = {
    space: ResponsiveValue<'paddingLeft'>
    class?: string
  }
</script>

<script lang="ts">
  import Box from '../box'

  type $$Props = Props

  export let space: $$Props['space'] = 'none'
  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<Box class={className} display="flex" paddingLeft={space} direction="row">
  <slot />
</Box>
