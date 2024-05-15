import BarChart, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/charts/BarChart'
import { type QueryRequestProps } from '$src/data'
import useQuery from '$src/lib/internal/shared/useQuery'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryBarChart({
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
    <BarChart
      data={data}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryBarChart
