<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-data/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h6" leading="h6" as="h6" {...restProps}>
  <slot />
</Text>
