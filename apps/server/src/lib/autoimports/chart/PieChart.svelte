<script lang="ts">
  import { PieChart } from '@latitude-data/svelte/internal'
  import type { PieChartProps } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { DEFAULT_HEIGHT } from './constants'
  import { api } from '@latitude-data/client'

  type $$Props = Omit<
    PieChartProps,
    'download' | 'data' | 'isLoading' | 'error'
  > &
    QueryProps & { download?: boolean }

  export let query: $$Props['query']
  export let inlineParams: $$Props['inlineParams'] = {}
  export let opts: $$Props['opts'] = {}
  export let height: $$Props['height'] = DEFAULT_HEIGHT
  export let download: $$Props['download'] = false
  const downloadFn = download
    ? () => api.downloadQuery({ queryPath: query, params: inlineParams })
    : undefined

  const result = useQuery({ query, inlineParams, opts })
</script>

<PieChart
  {height}
  download={downloadFn}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
