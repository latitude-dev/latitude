<script context="module" lang="ts">
  export type Props = {
    class?: string | undefined
    data: QueryResult
  }
</script>

<script lang="ts">
  import { createTable, Render, Subscribe } from 'svelte-headless-table'
  import { readable } from 'svelte/store'
  import * as Table from '$lib/internal/ui/_table'
  import QueryResult from '@latitude-data/query_result'

  type $$Props = Props

  export let data: $$Props['data'] = new QueryResult({})

  let className: $$Props['class'] = undefined
  export { className as class }

  const table = createTable(readable(data.toArray()))

  const columns = table.createColumns(
    data.fields.map((field) =>
      table.column({ accessor: field.name, header: field.name })
    )
  )

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns)
</script>

<Table.Root {...$tableAttrs} class={className}>
  <Table.Header>
    {#each $headerRows as headerRow}
      <Subscribe rowAttrs={headerRow.attrs()}>
        <Table.Row>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
              <Table.Head {...attrs}>
                <Render of={cell.render()} />
              </Table.Head>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Header>
  <Table.Body {...$tableBodyAttrs}>
    {#each $pageRows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <Table.Row {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <Table.Cell {...attrs}>
                <Render of={cell.render()} />
              </Table.Cell>
            </Subscribe>
          {/each}
        </Table.Row>
      </Subscribe>
    {/each}
  </Table.Body>
</Table.Root>
