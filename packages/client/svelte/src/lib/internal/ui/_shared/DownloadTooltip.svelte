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
    style="box-shadow: 0px 16px 80px 0px #07132414, 0px 8px 24px 0px #0713241F, 0px 0px 4px 0px #07132414;"
  >
    <button class={theme.ui.downloadTooltip.option()} on:click={download}>
      <Text size="h5" weight="medium" color="gray800">Download as CSV</Text>
    </button>
    <Popover.Arrow />
  </Popover.Content>
</Popover.Root>
