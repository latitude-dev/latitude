<script lang="ts">
  import * as Tooltip from '../../tooltip'
  import DarkModeButton from '../../dark-mode-button'
  import { Card } from '$lib'
  import { themeConfig } from '../store'
  import { mode } from 'mode-watcher'
  import { theme as client } from '@latitude-sdk/client'
  import { Check } from 'radix-icons-svelte'
  import { COLORS, COLOR_KEYS } from './colors'

  const { cn } = client.utils
  const themes = client.skins.themes
</script>

<Card.Root>
  <Card.Content class="flex items-center justify-between pt-6">
    <div class="flex items-center space-x-0.5">
      {#each COLOR_KEYS as color (color)}
        {@const theme = themes.find((tm) => tm.name === color)}
        {@const isActive = $themeConfig.name === color}
        {#if theme}
          <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
              <button
                {...builder}
                use:builder.action
                on:click={() => themeConfig.update(() => theme)}
                class={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs',
                  isActive ? 'border-[--theme-primary]' : 'border-transparent'
                )}
                style="--theme-primary: hsl({COLORS[theme.name][
                  $mode === 'dark' ? 'dark' : 'light'
                ]}"
              >
                <span
                  class={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]'
                  )}
                >
                  {#if isActive}
                    <Check class="h-4 w-4 text-white" />
                  {/if}
                </span>
                <span class="sr-only">{theme.label}</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              align="center"
              class="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
            >
              {theme.label}
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      {/each}
    </div>
    <DarkModeButton />
  </Card.Content>
</Card.Root>
