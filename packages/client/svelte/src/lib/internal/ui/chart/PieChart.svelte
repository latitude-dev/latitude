<script context="module" lang="ts">
  import { type PieChartProps as CorePieChartProps } from '@latitude-sdk/client'
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type WrapperProps } from './_Wrapper.svelte'

  export type PieChartProps = Omit<EchartProps, 'isComputing' | 'options'> &
    Omit<CorePieChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Wrapper from './_Wrapper.svelte'
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  const generatePieConfig = theme.ui.chart.generatePieConfig

  export let data: PieChartProps['data'] = null
  export let isLoading: PieChartProps['isLoading'] = false
  export let error: PieChartProps['error'] = null

  export let displayName: PieChartProps['displayName'] = undefined
  export let width: PieChartProps['width'] = undefined
  export let height: PieChartProps['height'] = undefined
  export let locale: PieChartProps['locale'] = 'en'
  export let animation: PieChartProps['animation'] = false
  export let config: PieChartProps['config'] = undefined
</script>

<Wrapper {data} {isLoading} {error} let:dataset>
  <Echart
    options={generatePieConfig({ dataset, displayName, animation, config })}
    {width}
    {height}
    {locale}
  />
</Wrapper>
