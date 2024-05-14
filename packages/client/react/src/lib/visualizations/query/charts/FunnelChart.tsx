import FunnelChart, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/charts/FunnelChart'
import { type QueryRequestProps } from '$src/data'
import useQuery from '$src/lib/internal/shared/useQuery'

type Props = Omit<RawProps, 'data' | 'isLodaing' | 'error' | 'download'> &
  QueryRequestProps & {
    download?: boolean
  }

function QueryFunnelChart({
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
    <FunnelChart
      data={data}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryFunnelChart
