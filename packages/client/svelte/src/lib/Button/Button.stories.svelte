<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Button from './Button.svelte';

  export const meta: Meta = {
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component: "Description set explicitly in the meta export"
        }
      }
    }
  }
</script>

<Template let:args>
  <Button {...args}>
    Click me
  </Button>
</Template>

<Story name="Default"/>


