<script context="module" lang="ts">
  export type Props = {
    data: QueryResult
    class?: string | undefined
    description?: string
    download?: () => Promise<void> | undefined
    title?: string
  }
</script>

<script lang="ts">
  import * as Table from '$lib/internal/ui/_table'
  import QueryResult from '@latitude-data/query_result'
  import { Card } from '$lib'
  import { createTable, Render, Subscribe } from 'svelte-headless-table'
  import { readable } from 'svelte/store'
  import VisualizationHeader from '../_shared/VisualizationHeader.svelte'

  type $$Props = Props

  export let data: $$Props['data'] = new QueryResult({})
  export let description: $$Props['description'] = undefined
  export let download: $$Props['download'] = undefined
  export let title: $$Props['title'] = undefined

  let className: $$Props['class'] = undefined
  export { className as class }

  $: table = createTable(readable(data.toArray()))
  $: columns = table.createColumns(
    data.fields.map((field) =>
      table.column({ accessor: field.name, header: field.name })
    )
  )
  $: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns))
</script>

<Card.Root type="invisible" class="flex flex-col gap-4">
  <VisualizationHeader {title} {description} {download} />
  <Card.Content type="invisible">
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
  </Card.Content>
</Card.Root>
