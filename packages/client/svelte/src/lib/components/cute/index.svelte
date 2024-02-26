<script context="module" lang="ts">
  import { Card } from '$lib'
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Latitude UI</Card.Title>
    <Card.Description>Svelte components for Latitude</Card.Description>
  </Card.Header>
  <Card.Content>
    <slot />
  </Card.Content>
</Card.Root>
