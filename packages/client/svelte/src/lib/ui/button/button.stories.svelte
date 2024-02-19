<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Cute from '$lib/components/cute/index.svelte'
  import Button from './index.svelte';
  import { BUTTON_VARIANTS, BUTTON_SIZES } from './index'

  export const meta: Meta = {
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        options: BUTTON_VARIANTS,
        control: { type: 'select' }
      },
      size: {
        options: BUTTON_SIZES,
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


