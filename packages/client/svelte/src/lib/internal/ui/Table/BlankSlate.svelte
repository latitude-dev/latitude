<script lang="ts">
  export let loading = false
  export let error: Error | undefined | null
</script>

{#if loading}
  loading...
{:else if error}
  error: {error.message}
{:else}
  <slot />
{/if}
