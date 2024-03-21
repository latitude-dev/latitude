<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import Alert, { type Props } from './alert.svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import { theme } from '@latitude-data/client'

  type Args = Props & {
    text: string
  }
  export const meta = {
    title: 'Alert',
    component: Alert,
    argTypes: {
      type: {
        options: theme.ui.alert.ALERT_TYPES,
        control: { type: 'select' },
      },
      fontWeight: {
        options: ['normal', 'medium', 'bold'],
        control: { type: 'select' },
      },
      secondary: { control: { type: 'boolean' } },
      centerText: { control: { type: 'boolean' } },
    },
    args: {
      text: 'This is an alert message. Please be careful',
      type: 'primary',
      fontWeight: 'normal',
      secondary: false,
      centerText: true,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template let:args>
  <Alert
    type={args.type}
    secondary={args.secondary}
    centerText={args.centerText}
    fontWeight={args.fontWeight}
  >
    {args.text}
  </Alert>
</Template>

<Story name="Default" />
