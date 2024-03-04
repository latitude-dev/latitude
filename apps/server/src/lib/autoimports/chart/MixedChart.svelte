<script lang="ts">
  import type { MixedChartProps } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { MixedChart } from '@latitude-data/svelte/internal'
  type Props = Omit<MixedChartProps, 'data' | 'isLoading' | 'error'> &
    QueryProps
  import { DEFAULT_HEIGHT } from './constants'

  export let query: Props['query']
  export let inlineParams: Props['inlineParams'] = {}
  export let opts: Props['opts'] = {}
  export let height: Props['height'] = DEFAULT_HEIGHT
  export let x: Props['x']
  export let y: Props['y']

  const result = useQuery({ query, inlineParams, opts })
</script>

<MixedChart
  {height}
  {x}
  {y}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
