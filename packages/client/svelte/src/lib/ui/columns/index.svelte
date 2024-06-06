<script context="module" lang="ts">
  import { type ResponsiveValue } from '@latitude-data/client'
  export type Props = {
    space: ResponsiveValue<'gap'>
    class?: string
  }
</script>

<script lang="ts">
  import Box from '../box'

  type $$Props = Props

  // TODO: Implement collpaseBelow prop
  export let space: $$Props['space'] = 'none'
  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<Box class={className} gap={space} direction="row">
  <slot />
</Box>
