<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import LineChart, { type LineChartProps } from './LineChart.svelte'
  import data from './__mock__/data'

  type Args = LineChartProps & {
    swapAxis: boolean
    'config.showLegend': boolean
  }
  export const meta = {
    title: 'Charts/LineChart',
    component: LineChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
    },
    args: {
      data,
      isLoading: false,
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      'config.showLegend': false,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template id="line" let:args>
  <LineChart
    height={400}
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={[
      { name: 'node_events_sum' },
      { name: 'project_events_sum' },
      { name: 'workspace_events_sum' },
    ]}
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showLegend: args.config.showLegend,
    }}
  />
</Template>

<Story name="Basic" template="line" />
