<script context="module" lang="ts">
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type ScatterChartProps as ClientScatterChartProps } from '@latitude-sdk/client'
  import type { WrapperProps } from './_Wrapper.svelte'

  export type ScatterChartProps = Omit<EchartProps, 'options'> &
    Omit<ClientScatterChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import Wrapper from './_Wrapper.svelte'
  const generate = theme.ui.chart.generateScatterConfig

  export let data: ScatterChartProps['data'] = null
  export let isLoading: ScatterChartProps['isLoading'] = false
  export let error: ScatterChartProps['error'] = null

  export let x: ScatterChartProps['x']
  export let y: ScatterChartProps['y']
  export let width: ScatterChartProps['width'] = undefined
  export let height: ScatterChartProps['height'] = undefined
  export let locale: ScatterChartProps['locale'] = 'en'
  export let animation: ScatterChartProps['animation'] = false
  export let sizeColumn: ScatterChartProps['sizeColumn']
  export let style: ScatterChartProps['style'] = 'circle'
  export let swapAxis: ScatterChartProps['swapAxis'] = false
  export let yTitle: ScatterChartProps['yTitle'] = ''
  export let xTitle: ScatterChartProps['xTitle'] = ''
  export let xFormat: ScatterChartProps['xFormat'] = undefined
  export let yFormat: ScatterChartProps['yFormat'] = undefined
  export let config: ScatterChartProps['config'] = {}
</script>

<Wrapper {data} {isLoading} {error} let:dataset>
  <Echart
    options={generate({
      dataset,
      animation,
      x,
      y,
      sizeColumn,
      style,
      yTitle,
      xTitle,
      swapAxis,
      xFormat,
      yFormat,
      config,
    })}
    {width}
    {height}
    {locale}
  />
</Wrapper>
