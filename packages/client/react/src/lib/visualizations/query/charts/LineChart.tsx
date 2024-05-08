import QueryResult from '@latitude-data/query_result'
import LineChart, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/charts/LineChart'
import { useQuery, type QueryRequestProps } from '$src/data'
import { useMemo } from 'react'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryLineChart({
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
    <LineChart
      data={result}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryLineChart
