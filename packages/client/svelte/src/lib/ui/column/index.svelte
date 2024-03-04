<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { Gap } from '@latitude-data/client/src/theme/ui/layout'

  export let gap: Gap = 4
  export let grow: boolean = false

  $: classes = theme.ui.column.cssClass({ gap, grow })
</script>

<div class={classes}>
  <slot />
</div>
