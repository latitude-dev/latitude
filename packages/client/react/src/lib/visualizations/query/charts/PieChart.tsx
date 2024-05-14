import PieChart from '$src/lib/visualizations/raw/charts/PieChart'
import useQuery from '$src/lib/internal/shared/useQuery'

import type { QueryRequestProps } from '$src/data'
import type { Props as RawProps } from '$src/lib/visualizations/raw/charts/PieChart'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryPieChart({
  queryPath,
  params,
  download = false,
  tanstaskQueryOptions,
  ...rest
}: Props) {
  const {
    data,
    isLoading,
    error,
    download: downloadFn,
  } = useQuery({ queryPath, params, tanstaskQueryOptions })

  return (
    <PieChart
      data={data}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryPieChart
