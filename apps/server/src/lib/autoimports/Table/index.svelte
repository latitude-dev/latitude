<script lang="ts">
  import QueryResult from '@latitude-data/query_result'
  import { Table, TableBlankSlate } from '@latitude-data/svelte/internal'
  import { useQuery, type QueryProps } from '$lib/stores/queries'

  type Props = QueryProps
  
  export let query: Props['query']
  export let inlineParams: Props['inlineParams'] = {}
  export let opts: Props['opts'] = {}

  let className: string | undefined
  export { className as class }

  let res = useQuery({ query, inlineParams, opts })
  $: data = $res.data as QueryResult
</script>

<TableBlankSlate loading={$res.isLoading} data={$res.data} error={$res.error}>
  <Table {data} class={className} />
</TableBlankSlate>
