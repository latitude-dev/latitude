<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps, theme } from '@latitude-sdk/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type MixedChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  const generate = theme.ui.chart.generateCartesianConfig

  export let data: MixedChartProps['data'] = null
  export let isLoading: MixedChartProps['isLoading'] = false
  export let error: MixedChartProps['error'] = null

  export let x: MixedChartProps['x']
  export let y: MixedChartProps['y']
  export let width: MixedChartProps['width'] = undefined
  export let height: MixedChartProps['height'] = undefined
  export let locale: MixedChartProps['locale'] = 'en'
  export let animation: MixedChartProps['animation'] = false
  export let swapAxis: MixedChartProps['swapAxis'] = false
  export let yTitle: MixedChartProps['yTitle'] = ''
  export let xTitle: MixedChartProps['xTitle'] = ''
  export let xFormat: MixedChartProps['xFormat'] = undefined
  export let yFormat: MixedChartProps['yFormat'] = undefined
  export let config: MixedChartProps['config'] = undefined
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
