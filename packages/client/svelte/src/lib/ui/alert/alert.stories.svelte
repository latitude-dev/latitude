<script context="module" lang="ts">
  import Alert from './alert.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'

  export const meta = {
    title: 'Alert',
    component: Alert,
    argTypes: {
      variant: {
        options: ['default', 'destructive'],
        control: { type: 'select' },
      },
    },
    args: { variant: 'default' },
    parameters: { layout: 'centered' },
  }
</script>

<Template let:args>
  <Alert {...args}>This is an alert message. Please be careful</Alert>
</Template>

<Story name="Default" />
