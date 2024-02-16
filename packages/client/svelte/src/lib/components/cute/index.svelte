<script context="module" lang="ts">
  import * as Card  from '$lib/ui/card'
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Latitude UI</Card.Title>
    <Card.Description>Svelte components for Latitude</Card.Description>
  </Card.Header>
  <Card.Content>
    <slot/>
  </Card.Content>
</Card.Root>

