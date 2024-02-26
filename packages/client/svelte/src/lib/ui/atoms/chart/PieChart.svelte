<script lang='ts'>
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type PieChartProps, theme } from '@latitude-sdk/client'
  const generatePieConfig = theme.ui.chart.generatePieConfig

  type $$Props = Omit<EchartProps, 'options'> & PieChartProps

  export let dataset: $$Props['dataset']
  export let displayName: $$Props['displayName']
  export let animation: $$Props['animation']
  export let config: $$Props['config']
  export let width: $$Props['width']
  export let height: $$Props['height']
  export let locale: $$Props['locale'] = 'en'
  export let isComputing: $$Props['isComputing'] = false
</script>

<Echart
  options={generatePieConfig({ dataset, displayName, animation, config })}
  {width}
  {height}
  {locale}
  {isComputing}
/>
