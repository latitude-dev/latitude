<script context="module" lang="ts">
  import type { Meta } from '@storybook/svelte'
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import ScatterChart, { type Props } from './ScatterChart.svelte'

  type Args = Props & {
    'config.showLegend': boolean
  }
  export const meta = {
    title: 'Charts/ScatterChart',
    component: ScatterChart,
    argTypes: {
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      style: { control: 'select', options: ['circle', 'emptyCircle'] },
      'config.showLegend': { control: 'boolean' },
    },
    args: {
      yTitle: 'Y Column',
      xTitle: 'X Column'
    },
    parameters: { layout: 'centered' }
  } satisfies Meta<Args>
</script>

<Template id='scatter' let:args>
  <ScatterChart
    x='x_column'
    y='y_column'
    sizeColumn='SizeColumn'

    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showLegend: args.config.showLegend,
    }}
    dataset={{
      fields: ['y_column', 'x_column', 'SizeColumn'],
      source: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['10', '11', '12'],
        ['13', '14', '15'],
      ]
    }}
  />
</Template>

<Story name="Basic" template='scatter' />

