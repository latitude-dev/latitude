<script lang="ts">
  import QueryResult from '@latitude-sdk/query_result'
  import { Table, TableBlankSlate } from '@latitude-sdk/svelte/internal'
  import { useQuery } from '$lib/stores/queries'

  export let query: string

  let res = useQuery(query)
  $: data = $res.data as QueryResult
</script>

<TableBlankSlate loading={$res.isLoading} error={$res.error}>
  <Table {data} />
</TableBlankSlate>
