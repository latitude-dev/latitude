<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-data/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h4" leading="h4" as="h4" {...restProps}>
  <slot />
</Text>
