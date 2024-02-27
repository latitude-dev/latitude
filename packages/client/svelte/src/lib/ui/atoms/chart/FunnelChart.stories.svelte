<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import FunnelChart from './FunnelChart.svelte'

  export const meta: Meta = {
    title: 'Charts/FunnelChart',
    component: FunnelChart,
    argTypes: {
      animation: { control: 'boolean' },
      sort: {
        control: 'select',
        options: ['descending', 'ascending']
      },
      showGradientColor: { control: 'boolean' },
      showLabels: { control: 'boolean' },
      showDecal: { control: 'boolean' },
      showLegend: { control: 'boolean' },
    },
    args: {
      sort: 'descending',
      showGradientColor: false,
      showLabels: true,
      showDecal: false,
      showLegend: false,
    },
    parameters: { layout: 'centered' }
  }
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
    showColorGradient={args.showGradientColor}
    showLabels={args.showLabels}
    showDecal={args.showDecal}
    showLegend={args.showLegend}
  />
</Template>
<Story name="Basic" template='funnel' />

