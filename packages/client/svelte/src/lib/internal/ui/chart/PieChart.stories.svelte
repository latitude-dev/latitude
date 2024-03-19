<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import PieChart, { type PieChartProps } from './PieChart.svelte'
  import QueryResult, { DataType } from '@latitude-data/query_result'

  const data = new QueryResult({
    fields: [
      { name: 'Source', type: DataType.String },
      { name: 'Value', type: DataType.Integer },
    ],
    rows: [
      ['Search Engine', '1048'],
      ['Direct', '735'],
      ['Email', '580'],
      ['Union Ads', '484'],
      ['Video Ads', '300'],
    ],
    rowCount: 33,
  })

  type Args = PieChartProps & {
    showLabels: boolean
    showTotalValue: boolean
    showDecal: boolean
    showLegend: boolean
    showHole: boolean
    scatterStyle: 'circle' | 'emptyCircle'
  }
  export const meta = {
    title: 'Charts/PieChart',
    component: PieChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      showLabels: { control: 'boolean' },
      showTotalValue: { control: 'boolean' },
      showDecal: { control: 'boolean' },
      showLegend: { control: 'boolean' },
      showHole: { control: 'boolean' },
      scatterStyle: {
        control: 'select',
        options: ['circle', 'emptyCircle'],
      },
    },
    args: {
      data,
      isLoading: false,
      showLabels: true,
      showTotalValue: true,
      showDecal: false,
      showLegend: false,
      showHole: false,
      scatterStyle: 'circle',
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template id="pie" let:args>
  <PieChart
    height={400}
    data={args.data}
    isLoading={args.isLoading}
    displayName="Traffic Source"
    config={{
      showLabels: args.showLabels,
      showTotalValue: args.showTotalValue,
      showDecal: args.showDecal,
      showLegend: args.showLegend,
      showHole: args.showHole,
    }}
  />
</Template>

<Story name="Basic" template="pie" />
