<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Cute from '$lib/components/cute/index.svelte'
  import Button from './index.svelte';
  import { theme } from '@latitude-sdk/client'

  export const meta: Meta = {
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        options: theme.ui.button.BUTTON_VARIANTS,
        control: { type: 'select' }
      },
      size: {
        options: theme.ui.button.BUTTON_SIZES,
        control: { type: 'select' }
      }
    },
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component: "Button component"
        }
      }
    }
  }
</script>

<Template let:args>
  <Cute>
    <Button {...args}>
      Click me
    </Button>
  </Cute>
</Template>

<Story name="Default"/>


