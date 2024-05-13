<script lang="ts">
  import * as Tooltip from '$lib/ui/tooltip'
  import DarkModeButton from '$lib/ui/dark-mode-button'
  import { Card } from '$lib'
  import { themeConfig } from '../store'
  import { mode } from 'mode-watcher'
  import { theme as client } from '@latitude-data/client'
  import { Check } from 'radix-icons-svelte'

  const { cn } = client.utils
  const themes = client.skins.themes
  const themeKeys = Object.keys(themes)
</script>

<Card.Root>
  <Card.Content class="lat-flex lat-items-center lat-justify-between lat-pt-6">
    <div class="lat-flex lat-items-center lat-space-x-0.5">
      {#each themeKeys as color}
        {@const theme = themes[color]}
        {@const isActive = JSON.stringify($themeConfig) === JSON.stringify(themes[color])}
        {#if theme}
          <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
              <button
                {...builder}
                use:builder.action
                on:click={() => themeConfig.update(() => theme)}
                class={cn(
                  'lat-flex lat-h-9 lat-w-9 lat-items-center lat-justify-center lat-rounded-full lat-border-2 lat-text-xs',
                  isActive ? 'lat-border-[--theme-primary]' : 'lat-border-transparent',
                )}
                style="--theme-primary: {$mode === 'dark' ? themes[color].dark.primary : themes[color].primary}"
              >
                <span
                  class={cn(
                    'lat-flex lat-h-6 lat-w-6 lat-items-center lat-justify-center lat-rounded-full lat-bg-[--theme-primary]',
                  )}
                >
                  {#if isActive}
                    <Check class="lat-h-4 lat-w-4 lat-text-white" />
                  {/if}
                </span>
                <span class="lat-sr-only">{color}</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              align="center"
              class="lat-rounded-[0.5rem] lat-bg-zinc-900 lat-text-zinc-50"
            >
              {color}
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      {/each}
    </div>
    <DarkModeButton />
  </Card.Content>
</Card.Root>
