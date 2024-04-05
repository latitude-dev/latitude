<script lang="ts">
  import type { FunnelChartProps } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { FunnelChart } from '@latitude-data/svelte/internal'
  import { DEFAULT_HEIGHT } from './constants'
  import { api } from '@latitude-data/client'

  type $$Props = Omit<
    FunnelChartProps,
    'download' | 'data' | 'isLoading' | 'error'
  > &
    QueryProps & {
      download?: boolean
    }

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

<FunnelChart
  download={downloadFn}
  {height}
  data={$result.data}
  isLoading={$result.isLoading}
  error={$result.error}
  {...$$restProps}
/>
