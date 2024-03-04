<script context="module" lang="ts">
  import type { Gap } from '@latitude-data/client/src/theme/ui/layout'

  export type Props = {
    gap?: Gap
    grow?: boolean
    class?: string
  }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  type $$Props = Props

  let className: $$Props['class'] = undefined
  export let gap: $$Props['gap'] = undefined
  export let grow: $$Props['grow'] = undefined
  export { className as class }

  $: classes = theme.ui.row.cssClass({ gap, grow, className })
</script>

<div class={classes}>
  <slot />
</div>
