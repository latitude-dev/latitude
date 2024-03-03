<script context="module" lang="ts">
  import type { Dataset, QueryResultState } from '@latitude-sdk/client'

  export type WrapperProps = QueryResultState
</script>

<script lang="ts">
  import { theme as client } from '@latitude-sdk/client'
  const { cn } = client.utils
  import BlankSlate from './_BlankSlate.svelte'
  export let data: WrapperProps['data'] = null
  export let isLoading: WrapperProps['isLoading'] = false

  export let error: WrapperProps['error'] = null
  // TODO: What do we do when there is an error? Talking with Samu...
  if (error) console.error('error', error)

  $: dataset = {
    fields: data?.fields ? data.fields.map((f) => f.name) : [],
    source: data?.rows ?? [],
  } as Dataset
</script>

<div class={cn('relative h-full w-full', { 'animate-pulse': isLoading })}>
  {#if !data || (!data && isLoading)}
    <BlankSlate />
  {:else}
    <slot {dataset} />
  {/if}
</div>
