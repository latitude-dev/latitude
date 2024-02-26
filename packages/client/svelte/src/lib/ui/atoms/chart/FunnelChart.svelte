<script lang='ts'>
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type FunnelChartProps, theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateFunnelConfig

  type $$Props = Omit<EchartProps, 'options'> & FunnelChartProps

  export let width: $$Props['width']
  export let height: $$Props['height']
  export let locale: $$Props['locale'] = 'en'
  export let isComputing: $$Props['isComputing'] = false
  export let dataset: $$Props['dataset']
  export let animation: $$Props['animation']
  export let sort: $$Props['sort'] = 'descending'
  export let showColorGradient: $$Props['showColorGradient'] = false
  export let showLabels: $$Props['showLabels'] = true
  export let showDecal: $$Props['showDecal'] = false
  export let showLegend: $$Props['showLegend'] = false
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
