<script context="module" lang="ts">
  import Columns from './index.svelte'
  import { Column, Placeholder } from '$lib'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { spaces } from '@latitude-data/client'

  export const meta = {
    title: 'Columns',
    component: Columns,
    argTypes: {
      space: {
        options: spaces,
        control: { type: 'select' },
      },
    },
    args: {
      space: 'gutter',
    },
    parameters: {
      docs: {
        description: {
          component: 'Columns component',
        },
      },
    },
  }
</script>

<Template let:args>
  <Columns {...args}>
    <Column>
      <Placeholder label="Column 1" />
    </Column>
    <Column>
      <Placeholder label="Column 2" />
    </Column>
  </Columns>
</Template>

<Story name="Default" />
