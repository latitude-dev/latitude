<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import PieChart from './PieChart.svelte'

  export const meta: Meta = {
    title: 'Charts/PieChart',
    component: PieChart,
    argTypes: {
      showLabels: { control: 'boolean' },
      showTotalValue: { control: 'boolean' },
      showDecal: { control: 'boolean' },
      showLegend: { control: 'boolean' },
      showHole: { control: 'boolean' },
      scatterStyle: {
        control: 'select',
        options: ['circle', 'emptyCircle']
      },
    },
    args: {
      showLabels: true,
      showTotalValue: true,
      showDecal: false,
      showLegend: false,
      showHole: false,
      scatterStyle: 'circle',
    },
    parameters: { layout: 'centered' }
  }
</script>

<Template id="pie" let:args>
  <PieChart
    displayName='Traffic Source'
    dataset={{
      fields: ['Source', 'Value'],
      source: [
        ['Search Engine', '1048'],
        ['Direct', '735'],
        ['Email', '580'],
        ['Union Ads', '484'],
        ['Video Ads', '300'],
      ]
    }}
    config={{
      showLabels: args.showLabels,
      showTotalValue: args.showTotalValue,
      showDecal: args.showDecal,
      showLegend: args.showLegend,
      showHole: args.showHole,
    }}
  />
</Template>
<Story name="Basic" template='pie' />
