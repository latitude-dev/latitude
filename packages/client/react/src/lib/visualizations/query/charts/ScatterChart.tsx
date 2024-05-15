import ScatterChart, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/charts/ScatterChart'
import { type QueryRequestProps } from '$src/data'
import useQuery from '$src/lib/internal/shared/useQuery'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryScatterChart({
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
    <ScatterChart
      data={data}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryScatterChart
