<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import type { Gap } from '@latitude-sdk/client/src/theme/ui/layout'

  export let gap: Gap = 4
  export let grow: boolean = false

  $: classes = theme.ui.column.cssClass({ gap, grow })
</script>

<div class={classes}>
  <slot />
</div>
