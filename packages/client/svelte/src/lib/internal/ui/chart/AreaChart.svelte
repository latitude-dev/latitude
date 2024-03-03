<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps } from '@latitude-sdk/client'
  import { type WrapperProps } from './_Wrapper.svelte'

  export type AreaChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  import Wrapper from './_Wrapper.svelte'
  const generate = theme.ui.chart.generateAreaConfig

  export let data: AreaChartProps['data'] = null
  export let isLoading: AreaChartProps['isLoading'] = false
  export let error: AreaChartProps['error'] = null

  export let x: AreaChartProps['x']
  export let y: AreaChartProps['y']
  export let width: AreaChartProps['width'] = undefined
  export let height: AreaChartProps['height'] = undefined
  export let locale: AreaChartProps['locale'] = 'en'
  export let animation: AreaChartProps['animation'] = false
  export let swapAxis: AreaChartProps['swapAxis'] = false
  export let yTitle: AreaChartProps['yTitle'] = ''
  export let xTitle: AreaChartProps['xTitle'] = ''
  export let xFormat: AreaChartProps['xFormat'] = undefined
  export let yFormat: AreaChartProps['yFormat'] = undefined
  export let config: AreaChartProps['config'] = undefined
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
