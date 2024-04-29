<script lang="ts">
  import { resetMode, setMode } from 'mode-watcher'
  import { Moon, Sun } from 'radix-icons-svelte'
  import * as DropdownMenu from '../dropdown-menu'
  import Button from '../button/index.svelte'
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="lat-relative lat-w-9 lat-px-0">
      <Sun
        class="lat-absolute dark:-lat-rotate-90 lat-h-[1.2rem] lat-w-[1.2rem] lat-rotate-0 lat-scale-100 lat-transition-all dark:lat-scale-0"
      />
      <Moon
        class="lat-absolute lat-h-[1.2rem] lat-w-[1.2rem] lat-rotate-90 lat-scale-0 lat-transition-all dark:lat-rotate-0 dark:lat-scale-100"
      />
      <span class="lat-sr-only">Toggle theme</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item on:click={() => setMode('light')}
      >Light</DropdownMenu.Item
    >
    <DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
