import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import type QueryResult from '@latitude-data/query_result'
import { Card } from '$src'
import VisualizationHeader from '$src/lib/internal/shared/VisualizationHeader'
import * as Table from '$src/lib/internal/table'

interface Props {
  data: QueryResult
  className?: string
  title?: string
  description?: string
  download?: () => Promise<void>
}

function TableComponent({
  data,
  className,
  description,
  download,
  title,
}: Props) {
  const columns = useMemo(
    () =>
      data.fields.map((field) => ({
        Header: field.name,
        accessor: field.name,
      })),
    [data.fields],
  )

  const memoizedData = useMemo(() => data.toArray(), [data])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: memoizedData }, useSortBy)

  return (
    <Card.Root type='invisible' className='lat-flex lat-flex-col lat-gap-4'>
      <VisualizationHeader
        title={title}
        description={description}
        download={download}
      />
      <Card.Content type='invisible'>
        <Table.Root {...getTableProps()} className={className}>
          <Table.Header>
            {headerGroups.map((headerGroup) => (
              <Table.Row
                {...headerGroup.getHeaderGroupProps()}
                key={`header-group-${headerGroup.id}`}
              >
                {headerGroup.headers.map((column) => (
                  <Table.Head
                    {...column.getHeaderProps()}
                    key={`header-${column.id}`}
                  >
                    {column.render('Header')}
                  </Table.Head>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              return (
                <Table.Row {...row.getRowProps()} key={`row-${index}`}>
                  {row.cells.map((cell) => (
                    <Table.Cell
                      {...cell.getCellProps()}
                      key={`cell-${cell.column.id}-${row.id}`}
                    >
                      {cell.render('Cell')}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  )
}

export default TableComponent
