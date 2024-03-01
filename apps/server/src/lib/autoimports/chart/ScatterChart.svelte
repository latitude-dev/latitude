<script lang="ts">
  import type { ScatterChartProps } from '@latitude-sdk/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { ScatterChart } from '@latitude-sdk/svelte/internal'
  type Props = Omit<ScatterChartProps, 'data' | 'isLoading' | 'error'> &
    QueryProps
  import { DEFAULT_HEIGHT } from './constants'

  export let query: Props['query']
  export let inlineParams: Props['inlineParams'] = {}
  export let opts: Props['opts'] = {}
  export let height: Props['height'] = DEFAULT_HEIGHT
  export let x: Props['x']
  export let y: Props['y']
  export let sizeColumn: Props['sizeColumn']

  const result = useQuery({ query, inlineParams, opts })
</script>

<ScatterChart
  {height}
  {x}
  {y}
  {sizeColumn}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
