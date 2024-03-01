<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps } from '@latitude-sdk/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type LineChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateLineConfig

  export let data: LineChartProps['data'] = null
  export let isLoading: LineChartProps['isLoading'] = false
  export let error: LineChartProps['error'] = null

  export let x: LineChartProps['x']
  export let y: LineChartProps['y']
  export let width: LineChartProps['width'] = undefined
  export let height: LineChartProps['height'] = undefined
  export let locale: LineChartProps['locale'] = 'en'
  export let animation: LineChartProps['animation'] = false
  export let yTitle: LineChartProps['yTitle'] = ''
  export let xTitle: LineChartProps['xTitle'] = ''
  export let swapAxis: LineChartProps['swapAxis'] = false
  export let xFormat: LineChartProps['xFormat'] = undefined
  export let yFormat: LineChartProps['yFormat'] = undefined
  export let config: LineChartProps['config'] = undefined
</script>

<Wrapper {data} {isLoading} {error} let:dataset>
  <Echart
    isComputing={isLoading}
    options={generate({
      dataset,
      animation,
      x,
      y,
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
