<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import QueryResult, { DataType } from '@latitude-data/query_result'
  import FunnelChart from './FunnelChart.svelte'

  const data = new QueryResult({
    fields: [
      { name: 'Actions', type: DataType.String },
      { name: 'Values', type: DataType.Integer },
    ],
    rows: [
      [100, 'Visit'],
      [60, 'Show'],
      [80, 'Click'],
      [40, 'Inquiry'],
      [20, 'Deal'],
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
      orientation: {
        control: 'select',
        options: ['vertical', 'horizontal'],
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
      orientation: 'vertical',
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
    height={400}
    data={args.data}
    isLoading={args.isLoading}
    animation={args.animation}
    sort={args.sort}
    orientation={args.orientation}
    showColorGradient={args.showColorGradient}
    showLabels={args.showLabels}
    showDecal={args.showDecal}
    showLegend={args.showLegend}
  />
</Template>
<Story name="Basic" template="funnel" />
