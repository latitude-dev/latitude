<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import BarChart, { type BarChartProps } from './BarChart.svelte'
  import data from './__mock__/data'

  type Args = BarChartProps & {
    'config.showValues': boolean
    'config.showLegend': boolean
    'config.showDecal': boolean
  }
  export const meta = {
    title: 'Charts/BarChart',
    component: BarChart,
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

<Template id="bar" let:args>
  <BarChart
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
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

<Story name="Basic" template="bar" />

<Template id="barStack" let:args>
  <BarChart
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
    yFormat={{ stack: true }}
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

<Story name="Stack" template="barStack" />

<Template id="barStack100%" let:args>
  <BarChart
    data={args.data}
    isLoading={args.isLoading}
    x="event_month"
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
    yFormat={{ stack: 'normalized' }}
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

<Story name="Stack 100%" template="barStack100%" />
