import Table, {
  type Props as RawProps,
} from '$src/lib/visualizations/raw/table'
import { type QueryRequestProps } from '$src/data'
import useQuery from '$src/lib/internal/shared/useQuery'

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
    isLoading,
    error,
    download: downloadFn,
  } = useQuery({ queryPath, params, tanstaskQueryOptions })

  return (
    <Table
      data={data}
      isLoading={isLoading}
      error={error}
      download={download ? downloadFn : undefined}
      {...rest}
    />
  )
}

export default QueryTable
