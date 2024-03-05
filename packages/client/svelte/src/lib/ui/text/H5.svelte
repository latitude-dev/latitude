<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-data/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h5" leading="h5" as="h5" {...restProps}>
  <slot />
</Text>
