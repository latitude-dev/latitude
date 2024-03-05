<script lang="ts">
  import type { FunnelChartProps } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { FunnelChart } from '@latitude-data/svelte/internal'
  type $$Props = Omit<FunnelChartProps, 'data' | 'isLoading' | 'error'> &
    QueryProps
  import { DEFAULT_HEIGHT } from './constants'

  export let query: $$Props['query']
  export let inlineParams: $$Props['inlineParams'] = {}
  export let opts: $$Props['opts'] = {}
  export let height: $$Props['height'] = DEFAULT_HEIGHT

  const result = useQuery({ query, inlineParams, opts })
</script>

<FunnelChart
  {height}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
