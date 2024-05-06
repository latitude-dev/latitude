<script context="module" lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import QueryResult, { DataType } from '@latitude-data/query_result'
  import FunnelChart from './FunnelChart.svelte'

  const data = {
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
  }

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
  }
</script>

<Template id="funnel" let:args>
  <FunnelChart
    height={400}
    data={new QueryResult(args.data)}
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
