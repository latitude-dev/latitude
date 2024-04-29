<script context="module" lang="ts">
  import Link from './index.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'

  export const meta = {
    title: 'Link',
    component: Link,
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      to: {
        control: {
          type: 'text',
        },
      },
      newTab: {
        control: {
          type: 'boolean',
        },
      },
    },
  }
</script>

<Template let:args>
  <div class="lat-max-w-100">
    <Link {...args}>Click me</Link>
  </div>
</Template>

<Story name="Default" />
