<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { DATASET } from './__mock__/data'
  import MixedChart from './MixedChart.svelte'

  export const meta: Meta = {
    title: 'Charts/MixedChart',
    component: MixedChart,
    argTypes: {
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      'config.showValues': { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
      'config.showDecal': { control: 'boolean' },
    },
    args: {
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      'config.showValues': false,
      'config.showLegend': false,
      'config.showDecal': false,
    },
    parameters: { layout: 'centered' }
  }
</script>
<Template id='mixed' let:args>
  <MixedChart
    dataset={DATASET}
    x='event_month'
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
<Story name="Mixed" template='mixed' />

