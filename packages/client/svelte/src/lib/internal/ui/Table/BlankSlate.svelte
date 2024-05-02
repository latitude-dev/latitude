<script lang="ts">
  import { theme } from '@latitude-data/client'

  import type QueryResult from '@latitude-data/query_result'

  const { cn } = theme.utils

  export let loading = false
  export let error: Error | undefined | null
  export let data: QueryResult | null | undefined
  export let height: number | string = '100%'

  $: classes = cn('relative lat-h-full lat-w-full', { 'animate-pulse': loading })
</script>

<div class={classes}>
  {#if !data && loading}
    <div
      class="lat-flex lat-w-full lat-flex-col lat-gap-4 lat-overflow-hidden"
      style="max-height: {height};"
    >
      <div class="lat-grid lat-grid-cols-4 lat-gap-4 lat-rounded-lg lat-bg-muted lat-p-4">
        <!-- eslint-disable-next-line -->
        {#each Array(4) as _, i (i)}
          <div
            class="animate-gradient lat-h-4 lat-rounded-full lat-bg-gradient-to-r from-muted via-white to-muted"
          />
        {/each}
      </div>
      <div class="lat-grid lat-grid-cols-4 lat-gap-4">
        <!-- eslint-disable-next-line -->
        {#each Array(120) as _}
          <div
            class="animate-gradient lat-h-4 lat-rounded-full lat-bg-gradient-to-r from-muted via-white to-muted"
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
