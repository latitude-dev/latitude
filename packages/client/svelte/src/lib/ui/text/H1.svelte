<script lang="ts">
  import Text from './Text.svelte'

  import type { theme } from '@latitude-sdk/client'

  export let restProps = $$restProps as theme.ui.text.HeaderProps
</script>

<Text size="h1" leading="h1" as="h1" {...restProps}>
  <slot />
</Text>
