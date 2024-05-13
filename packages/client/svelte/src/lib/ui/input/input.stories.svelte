<script context="module" lang="ts">
  import Input from './index.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'

  export const meta = {
    title: 'Input',
    component: Input,
    parameters: {
      layout: 'centered',
    },
  }
</script>

<Template let:args>
  <div class="lat-max-w-100">
    <Input {...args} />
  </div>
</Template>

<Story name="Default" />
