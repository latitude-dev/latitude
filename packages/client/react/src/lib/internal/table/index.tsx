import { default as TableRoot } from './table'
import { default as TableHeader } from './table-header'
import { default as TableBody } from './table-body'
import { default as TableHead } from './table-head'
import { default as TableRow } from './table-row'
import { default as TableCell } from './table-cell'

import { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import { Card } from '$src/lib/ui'
import VisualizationHeader from '$src/lib/internal/shared/VisualizationHeader'

import type QueryResult from '@latitude-data/query_result'

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
        <TableRoot {...getTableProps()} className={className}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={`header-group-${headerGroup.id}`}
              >
                {headerGroup.headers.map((column) => (
                  <TableHead
                    {...column.getHeaderProps()}
                    key={`header-${column.id}`}
                  >
                    {column.render('Header')}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()} key={`row-${index}`}>
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      key={`cell-${cell.column.id}-${row.id}`}
                    >
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </TableRoot>
      </Card.Content>
    </Card.Root>
  )
}

export { type Props }
export default TableComponent
