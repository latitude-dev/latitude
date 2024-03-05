<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import MixedChart, { type MixedChartProps } from './MixedChart.svelte'
  import data from './__mock__/data'

  type Args = MixedChartProps & {
    'config.showValues': boolean
    'config.showLegend': boolean
    'config.showDecal': boolean
  }
  export const meta: Meta = {
    title: 'Charts/MixedChart',
    component: MixedChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      'config.showValues': { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
      'config.showDecal': { control: 'boolean' },
    },
    args: {
      data,
      isLoading: false,
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      'config.showValues': false,
      'config.showLegend': false,
      'config.showDecal': false,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template id="mixed" let:args>
  <MixedChart
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={[
      { name: 'node_events_sum', chartType: 'line' },
      { name: 'project_events_sum', chartType: 'bar' },
    ]}
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showValues: args.config.showValues,
      showLegend: args.config.showLegend,
      showDecal: args.config.showDecal,
    }}
  />
</Template>
<Story name="Mixed" template="mixed" />
