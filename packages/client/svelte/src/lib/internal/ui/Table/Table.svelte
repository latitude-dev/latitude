<script lang="ts">
  import QueryResult from '@latitude-sdk/query_result'
  import {
    createColumnHelper,
    createSvelteTable,
    getCoreRowModel,
  } from '@tanstack/svelte-table'

  export let data: QueryResult

  const helper = createColumnHelper()

  $: options = {
    getCoreRowModel: getCoreRowModel(),
    data: data.toArray(),
    columns: data.fields.map((field) =>
      helper.accessor(field.name, {
        header: field.name,
      })
    ),
  }
  $: table = createSvelteTable(options)
</script>

<table class="border">
  <thead>
    <tr class="bg-secondary">
      {#each $table.getHeaderGroups() as headerGroup}
        {#each headerGroup.headers as column}
          <th class="px-4 py-2">{column.id}</th>
        {/each}
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each $table.getRowModel().rows as row}
      <tr class="border">
        {#each row.getVisibleCells() as cell}
          <td class="truncate border px-4 py-2">
            {cell.renderValue()}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
