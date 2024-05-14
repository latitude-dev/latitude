import QueryResult from '@latitude-data/query_result'
import PieChartData, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/charts/PieChart'
import { useQuery, type QueryRequestProps } from '$src/data'
import { useMemo } from 'react'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function PieChart({
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
    <PieChartData
      data={result}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default PieChart
