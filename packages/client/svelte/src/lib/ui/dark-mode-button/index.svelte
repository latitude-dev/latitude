<script lang="ts">
  import { resetMode, setMode } from 'mode-watcher'
  import { Moon, Sun } from 'radix-icons-svelte'
  import * as DropdownMenu from '../dropdown-menu'
  import Button from '../button/index.svelte'
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="w-9 px-0">
      <Sun
        class="dark:-roate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
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
