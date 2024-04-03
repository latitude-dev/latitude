<script context="module" lang="ts">
  import Combobox from '.';
  import { Story, Template } from '@storybook/addon-svelte-csf';

  export const meta = {
    title: 'Combobox',
    component: Combobox,
    argTypes: {
      items: {
        control: { type: 'object' },
      },
      value: {
        control: { type: 'text' },
      },
      onSelect: {
        action: 'onSelect',
      },
      searchBox: {
        control: { type: 'boolean' },
      },
      placeholder: {
        control: { type: 'text' },
      },
      searchPlaceholder: {
        control: { type: 'text' },
      },
      emptyMessage: {
        control: { type: 'text' },
      },
    },
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component: 'A customizable combobox component with optional search functionality.',
        },
      },
    },
  }
</script>

<Template let:args>
  <Combobox {...args} />
</Template>

<Story
  name="Default"
  args={{
    items: [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2', disabled: true }, { value: '3', label: 'Option 3' }],
    value: '1',
    searchBox: true,
    placeholder: 'Select an option',
    searchPlaceholder: 'Search...',
    emptyMessage: 'No items found.',
    class: 'w-[200px]',
  }}
/>
