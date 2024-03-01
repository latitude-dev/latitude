<script context="module" lang="ts">
  import type { Dataset, QueryResultState } from '@latitude-sdk/client'

  export type WrapperProps = QueryResultState
</script>

<script lang="ts">
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

{#if !data && isLoading}
  <div>Loading...</div>
{:else}
  <slot {dataset} />
{/if}
