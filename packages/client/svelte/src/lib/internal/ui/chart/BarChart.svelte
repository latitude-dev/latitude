<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps } from '@latitude-sdk/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type BarChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateBarConfig

  export let data: BarChartProps['data'] = null
  export let isLoading: BarChartProps['isLoading'] = false
  export let error: BarChartProps['error'] = null

  export let x: BarChartProps['x']
  export let y: BarChartProps['y']
  export let width: BarChartProps['width'] = undefined
  export let height: BarChartProps['height'] = undefined
  export let locale: BarChartProps['locale'] = 'en'
  export let animation: BarChartProps['animation'] = false
  export let yTitle: BarChartProps['yTitle'] = ''
  export let xTitle: BarChartProps['xTitle'] = ''
  export let swapAxis: BarChartProps['swapAxis'] = false
  export let xFormat: BarChartProps['xFormat'] = undefined
  export let yFormat: BarChartProps['yFormat'] = undefined
  export let config: BarChartProps['config'] = undefined
</script>

<Wrapper {data} {isLoading} {error} let:dataset>
  <Echart
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
