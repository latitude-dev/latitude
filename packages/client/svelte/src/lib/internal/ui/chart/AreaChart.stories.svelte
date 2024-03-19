<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import AreaChart, { type AreaChartProps } from './AreaChart.svelte'
  import data from './__mock__/data'

  type Args = AreaChartProps & {
    stack: boolean
    'config.showDots': boolean
    'config.showValues': boolean
    'config.showLegend': boolean
  }

  export const meta = {
    title: 'Charts/AreaChart',
    component: AreaChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      stack: { control: 'boolean' },
      'config.showDots': { control: 'boolean' },
      'config.showValues': { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
    },
    args: {
      data,
      isLoading: false,
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      stack: false,
      'config.showDots': true,
      'config.showValues': true,
      'config.showLegend': false,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template id="line" let:args>
  <AreaChart
    height={400}
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    yFormat={{ stack: args.stack }}
    swapAxis={args.swapAxis}
    config={{
      showDots: args.config.showDots,
      showValues: args.config.showValues,
      showLegend: args.config.showLegend,
    }}
  />
</Template>

<Story name="Basic" template="line" />
