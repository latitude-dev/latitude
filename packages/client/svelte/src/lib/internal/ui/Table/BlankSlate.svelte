<script lang="ts">
  import { theme } from '@latitude-data/client'

  import type QueryResult from '@latitude-data/query_result'

  const { cn } = theme.utils

  export let loading = false
  export let error: Error | undefined | null
  export let data: QueryResult | null | undefined
  export let height: number | string = '100%'

  $: classes = cn('relative h-full w-full', { 'animate-pulse': loading })
</script>

<div class={classes}>
  {#if !data && loading}
    <div
      class="flex w-full flex-col gap-4 overflow-hidden"
      style="max-height: {height};"
    >
      <div class="grid grid-cols-4 gap-4 rounded-lg bg-muted p-4">
        <!-- eslint-disable-next-line -->
        {#each Array(4) as _, i (i)}
          <div
            class="animate-gradient h-4 rounded-full bg-gradient-to-r from-muted via-white to-muted"
          />
        {/each}
      </div>
      <div class="grid grid-cols-4 gap-4">
        <!-- eslint-disable-next-line -->
        {#each Array(120) as _}
          <div
            class="animate-gradient h-4 rounded-full bg-gradient-to-r from-muted via-white to-muted"
          />
        {/each}
      </div>
    </div>
  {:else if error}
    error: {error.message}
  {:else}
    <slot />
  {/if}
</div>
