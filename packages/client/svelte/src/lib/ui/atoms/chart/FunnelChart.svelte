<script context='module' lang='ts'>
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type FunnelChartProps } from '@latitude-sdk/client'

  export type Props = Omit<EchartProps, 'options'> & FunnelChartProps
</script>

<script lang='ts'>
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateFunnelConfig

  export let dataset: Props['dataset']
  export let width: Props['width'] = undefined
  export let height: Props['height'] = undefined
  export let locale: Props['locale'] = 'en'
  export let isComputing: Props['isComputing'] = false
  export let animation: Props['animation'] = false
  export let sort: Props['sort'] = 'descending'
  export let showColorGradient: Props['showColorGradient'] = false
  export let showLabels: Props['showLabels'] = true
  export let showDecal: Props['showDecal'] = false
  export let showLegend: Props['showLegend'] = false
</script>

<Echart
  options={generate({
    dataset,
    animation,
    sort,
    showColorGradient,
    showLabels,
    showDecal,
    showLegend
  })}
  {width}
  {height}
  {locale}
  {isComputing}
/>
