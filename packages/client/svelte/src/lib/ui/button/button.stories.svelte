<script context="module" lang="ts">
  import Button from './index.svelte'
  import Cute from '$lib/components/cute/index.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { theme } from '@latitude-sdk/client'

  export const meta = {
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        options: theme.ui.button.BUTTON_VARIANTS,
        control: { type: 'select' },
      },
      size: {
        options: theme.ui.button.BUTTON_SIZES,
        control: { type: 'select' },
      },
    },
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component: 'Button component',
        },
      },
    },
  }
</script>

<Template let:args>
  <Cute>
    <Button {...args}>Click me</Button>
  </Cute>
</Template>

<Story name="Default" />
