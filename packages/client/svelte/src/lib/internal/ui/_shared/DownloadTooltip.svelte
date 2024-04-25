<script lang="ts">
  import { Popover, Text } from '$lib'
  import { theme } from '@latitude-data/client'

  export let download: (() => Promise<void> | undefined) | undefined
</script>

<Popover.Root>
  <Popover.Trigger>
    <div class={theme.ui.downloadTooltip.button()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="lat-h-6 lat-w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle cx="8" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="16" cy="12" r="1" fill="currentColor" />
      </svg>
    </div>
  </Popover.Trigger>
  <Popover.Content
    align="end"
    class={theme.ui.downloadTooltip.content()}
    style={`box-shadow: ${theme.ui.downloadTooltip.CONTENT_BOX_SHADOW}`}
  >
    <button class={theme.ui.downloadTooltip.option()} on:click={download}>
      <Text size="h5" weight="medium" color="gray800">Download as CSV</Text>
    </button>
    <Popover.Arrow />
  </Popover.Content>
</Popover.Root>
