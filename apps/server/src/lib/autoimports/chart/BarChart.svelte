<script lang="ts">
  import type { BarChartProps } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { BarChart } from '@latitude-data/svelte/internal'
  type Props = Omit<BarChartProps, 'data' | 'isLoading' | 'error'> & QueryProps
  import { DEFAULT_HEIGHT } from './constants'

  export let query: Props['query']
  export let inlineParams: Props['inlineParams'] = {}
  export let opts: Props['opts'] = {}
  export let height: Props['height'] = DEFAULT_HEIGHT
  export let x: Props['x']
  export let y: Props['y']

  const result = useQuery({ query, inlineParams, opts })
</script>

<BarChart
  {height}
  {x}
  {y}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
