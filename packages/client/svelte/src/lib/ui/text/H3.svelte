<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-data/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h3" leading="h3" as="h3" {...restProps}>
  <slot />
</Text>
