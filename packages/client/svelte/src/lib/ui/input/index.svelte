<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  export type Props = Omit<HTMLAttributes<HTMLInputElement>, 'value'> & {
    param: string
  }
</script>

<script lang="ts">
  import { useParam, setParam } from '$lib/core/params'
  import { onMount } from 'svelte'

  export let param: string

  let value = useParam(param)

  onMount(() => {
    const urlParam = new URLSearchParams(location.search).get(param)
    if (!urlParam) return

    setParam(param, urlParam)
  })
</script>

<input
  name={param}
  value={$value ?? ''}
  on:input={(ev) => setParam(param, ev.currentTarget.value)}
  {...$$restProps}
/>
