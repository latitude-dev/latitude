import type QueryResult from '@latitude-data/query_result'
import TableBlankSlate from '$src/lib/internal/shared/TableBlankSlate'
import TableComponent, {
  type Props as TableProps,
} from '$src/lib/internal/table'

type Props = Omit<TableProps, 'data'> & {
  isLoading: boolean
  data: QueryResult | null
  error?: Error
}

function Table({ data, isLoading = false, error, ...rest }: Props) {
  return (
    <TableBlankSlate loading={isLoading} data={data} error={error}>
      {data && <TableComponent data={data} {...rest} />}
    </TableBlankSlate>
  )
}

export { type Props }
export default Table
