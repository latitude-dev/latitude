<script lang="ts">
  import QueryResult from '@latitude-data/query_result'
  import { Table, TableBlankSlate } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'
  import { api } from '@latitude-data/client'

  type $$Props = QueryProps & {
    download?: boolean
    class?: string
    title?: string
    description?: string
  }

  export let query: $$Props['query']
  export let inlineParams: $$Props['inlineParams'] = {}
  export let opts: $$Props['opts'] = {}
  export let download: $$Props['download'] = false
  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined

  let className: string | undefined = undefined
  export { className as class }

  const downloadFn = download
    ? () => api.downloadQuery({ queryPath: query, params: inlineParams })
    : undefined

  let res = useQuery({ query, inlineParams, opts })
  $: data = $res.data as QueryResult
</script>

<TableBlankSlate loading={$res.isLoading} data={$res.data} error={$res.error}>
  <Table {data} {title} {description} download={downloadFn} class={className} />
</TableBlankSlate>
