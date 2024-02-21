<script lang="ts">
  import Button from '@latitude-sdk/svelte/button'
  import * as Card  from '@latitude-sdk/svelte/card'
</script>

<div class="h-full w-full flex items-center justify-center">
  <Card.Root>
    <Card.Header>
      <Card.Title>Latitude Data App</Card.Title>
      <Card.Description>Welcome, let's build something</Card.Description>
    </Card.Header>
    <Card.Content>
      <Button>Start building</Button>
    </Card.Content>
  </Card.Root>
</div>
