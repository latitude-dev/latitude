import Table, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/table'
import { useQuery, type QueryRequestProps } from '$src/data'
import { useMemo } from 'react'
import QueryResult from '@latitude-data/query_result'

type Props = Omit<RawProps, 'data' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryTable({
  queryPath,
  params,
  download = false,
  tanstaskQueryOptions,
  ...rest
}: Props) {
  const {
    data,
    isFetching: isLoading,
    error,
    download: downloadFn,
  } = useQuery({ queryPath, params, tanstaskQueryOptions })
  const result = useMemo(() => data && new QueryResult(data), [data])

  return (
    <Table
      data={result}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryTable
