<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import FunnelChart from './FunnelChart.svelte'

  export const meta = {
    title: 'Charts/FunnelChart',
    component: FunnelChart,
    argTypes: {
      animation: { control: 'boolean' },
      sort: {
        control: 'select',
        options: ['descending', 'ascending']
      },
      showColorGradient: { control: 'boolean' },
      showLabels: { control: 'boolean' },
      showDecal: { control: 'boolean' },
      showLegend: { control: 'boolean' },
    },
    args: {
      sort: 'descending',
      showColorGradient: false,
      showLabels: true,
      showDecal: false,
      showLegend: false,
    },
    parameters: { layout: 'centered' }
  } satisfies Meta<FunnelChart>
</script>

<Template id="funnel" let:args>
  <FunnelChart
    animation={args.animation}
    dataset={{
      fields: ['Actions', 'Values'],
      source: [
        ['Visit', 100],
        ['Show', 60],
        ['Click', 80],
        ['Inquiry', 40],
        ['Deal', 20]
      ]
    }}
    sort={args.sort}
    showColorGradient={args.showColorGradient}
    showLabels={args.showLabels}
    showDecal={args.showDecal}
    showLegend={args.showLegend}
  />
</Template>
<Story name="Basic" template='funnel' />

