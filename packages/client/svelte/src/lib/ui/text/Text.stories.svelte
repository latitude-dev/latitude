<script context="module" lang="ts">
  import Text from '.'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { Column } from '$lib'

  export const meta = {
    title: 'Text',
    component: Text,
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component: 'Text component',
        },
      },
    },
  }
</script>

<Template id="headers">
  <Column>
    <Text.H1>Header 1</Text.H1>
    <Text.H2>Header 2</Text.H2>
    <Text.H3>Header 3</Text.H3>
    <Text.H4>Header 4</Text.H4>
    <Text.H5>Header 5</Text.H5>
    <Text.H6>Header 6</Text.H6>
  </Column>
</Template>

<Story name="Headers" template="headers" />
