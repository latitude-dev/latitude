<script context="module" lang="ts">
  import { CaretSort } from 'radix-icons-svelte'
  import Button from './index.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { theme } from '@latitude-data/client'

  export const meta = {
    title: 'Button',
    component: Button,
    argTypes: {
      variant: {
        options: theme.ui.button.BUTTON_VARIANTS,
        control: { type: 'select' },
      },
      size: {
        options: theme.ui.button.BUTTON_SIZES,
        control: { type: 'select' },
      },
      ellipsis: {
        control: { type: 'boolean' },
      },
    },
    args: {
      variant: 'default',
      size: 'default',
      ellipsis: true,
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
  <div class="lat-flex lat-justify-start">
    <Button {...args}>
      {#if args.size !== 'icon'}
        This is a long long text to show ellipsis
      {/if}

      <slot slot="icon">
        <CaretSort />
      </slot>
    </Button>
  </div>
</Template>

<Story name="Default" />
