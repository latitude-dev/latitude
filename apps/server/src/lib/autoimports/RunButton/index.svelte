<script lang="ts">
  import { Button } from "@latitude-data/svelte"
  import { computeQuery } from "$lib/stores/queries"
  import { createEventDispatcher } from "svelte"

  export let query: string | undefined = undefined
  export let queries: string[] = []

  const dispatch = createEventDispatcher()

  const handleClick = () => {
    const queriesToRun = query ? [query] : queries
    computeQuery(queriesToRun)
    
    dispatch("click")
  }
</script>

<Button on:click={handleClick} {...$$restProps}>
  <slot />
</Button>