<script context="module" lang="ts">
  import * as Card from './index'
  import { Story, Template } from '@storybook/addon-svelte-csf'

  export const meta = {
    title: 'Card',
    component: Card,
    parameters: { layout: 'centered' },
  }
</script>

<Template let:args>
  <Card.Root {...args}>
    <Card.Header>
      <Card.Title>Movies analysis</Card.Title>
      <Card.Description>Movies and series data analysis</Card.Description>
    </Card.Header>
    <Card.Content>Some content here</Card.Content>
  </Card.Root>
</Template>

<Story name="Default" />
