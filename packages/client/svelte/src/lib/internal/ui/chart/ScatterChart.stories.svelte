<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import QueryResult, { DataType } from '@latitude-data/query_result'
  import ScatterChart, { type ScatterChartProps } from './ScatterChart.svelte'

  const data = new QueryResult({
    fields: [
      { name: 'y_column', type: DataType.Integer },
      { name: 'x_column', type: DataType.Integer },
      { name: 'SizeColumn', type: DataType.Integer },
    ],
    rows: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['10', '11', '12'],
      ['13', '14', '49'],
    ],
    rowCount: 33,
  })

  type Args = ScatterChartProps & { 'config.showLegend': boolean }
  export const meta = {
    title: 'Charts/ScatterChart',
    component: ScatterChart,
    argTypes: {
      data: { control: 'object' },
      isLoading: { control: 'boolean' },
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      style: { control: 'select', options: ['circle', 'emptyCircle'] },
      'config.showLegend': { control: 'boolean' },
    },
    args: {
      data,
      isLoading: false,
      yTitle: 'Y Column',
      xTitle: 'X Column',
      'config.showLegend': false,
    },
    parameters: { layout: 'centered' },
  } satisfies Meta<Args>
</script>

<Template id="scatter" let:args>
  <ScatterChart
    data={args.data}
    isLoading={args.isLoading}
    x="x_column"
    y="y_column"
    sizeColumn="SizeColumn"
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showLegend: args.config.showLegend,
    }}
  />
</Template>

<Story name="Basic" template="scatter" />
