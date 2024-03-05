<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type FunnelChartProps as ClientFunnelChartProps } from '@latitude-data/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type FunnelChartProps = Omit<EchartProps, 'options'> &
    Omit<ClientFunnelChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-data/client'
  const generate = theme.ui.chart.generateFunnelConfig

  type $$Props = FunnelChartProps
  export let data: $$Props['data'] = null
  export let isLoading: $$Props['isLoading'] = false
  export let error: $$Props['error'] = null

  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = false
  export let sort: $$Props['sort'] = 'descending'
  export let showColorGradient: $$Props['showColorGradient'] = false
  export let showLabels: $$Props['showLabels'] = true
  export let showDecal: $$Props['showDecal'] = false
  export let showLegend: $$Props['showLegend'] = false
</script>

<Wrapper {data} {isLoading} {error} let:dataset>
  <Echart
    options={generate({
      dataset,
      animation,
      sort,
      showColorGradient,
      showLabels,
      showDecal,
      showLegend,
    })}
    {width}
    {height}
    {locale}
  />
</Wrapper>
