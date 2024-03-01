<script lang="ts">
  import { PieChart } from '@latitude-sdk/svelte/internal'
  import type { PieChartProps } from '@latitude-sdk/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  type Props = Omit<PieChartProps, 'data' | 'isLoading' | 'error'> & QueryProps
  import { DEFAULT_HEIGHT } from './constants'

  export let query: Props['query']
  export let inlineParams: Props['inlineParams'] = {}
  export let opts: Props['opts'] = {}
  export let height: Props['height'] = DEFAULT_HEIGHT

  const result = useQuery({ query, inlineParams, opts })
</script>

<PieChart
  {height}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
