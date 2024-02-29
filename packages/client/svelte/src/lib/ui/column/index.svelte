<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import type { Gap } from '@latitude-sdk/client/src/theme/ui/layout'

  export let gap: Gap = 4
  export let grow: boolean = false
  let className: string

  export { className as class }

  $: classes =
    theme.ui.column.cssClass({ gap, grow }) + (className ? ` ${className}` : '')
</script>

<div class={classes}>
  <slot />
</div>
