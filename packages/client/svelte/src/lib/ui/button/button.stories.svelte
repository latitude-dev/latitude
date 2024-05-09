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
  <div class="flex w-36 justify-start">
    <Button {...args} class="w-full">
      This is a long long text to show ellipsis
      <slot slot="icon">
        <CaretSort class={theme.ui.combobox.BUTTON_ICON_CSS_CLASS} />
      </slot>
    </Button>
  </div>
</Template>

<Story name="Default" />
