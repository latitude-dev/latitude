<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import QueryResult, { DataType } from '@latitude-sdk/query_result'
  import FunnelChart from './FunnelChart.svelte'

  const data = new QueryResult({
    fields: [
      { name: 'Actions', type: DataType.String },
      { name: 'Values', type: DataType.Integer },
    ],
    rows: [
      ['Visit', 100],
      ['Show', 60],
      ['Click', 80],
      ['Inquiry', 40],
      ['Deal', 20],
    ],
    rowCount: 33,
  })

  export const meta = {
    title: 'Charts/FunnelChart',
    component: FunnelChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      animation: { control: 'boolean' },
      sort: {
        control: 'select',
        options: ['descending', 'ascending'],
      },
      showColorGradient: { control: 'boolean' },
      showLabels: { control: 'boolean' },
      showDecal: { control: 'boolean' },
      showLegend: { control: 'boolean' },
    },
    args: {
      data,
      isLoading: false,
      sort: 'descending',
      showColorGradient: false,
      showLabels: true,
      showDecal: false,
      showLegend: false,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<FunnelChart>
</script>

<Template id="funnel" let:args>
  <FunnelChart
    data={args.data}
    isLoading={args.isLoading}
    animation={args.animation}
    sort={args.sort}
    showColorGradient={args.showColorGradient}
    showLabels={args.showLabels}
    showDecal={args.showDecal}
    showLegend={args.showLegend}
  />
</Template>
<Story name="Basic" template="funnel" />
