<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-data/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h2" leading="h2" as="h2" {...restProps}>
  <slot />
</Text>
