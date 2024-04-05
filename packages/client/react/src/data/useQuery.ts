import { useCallback, useMemo, useState } from 'react'
import { useLatitude } from '$src/data/LatitudeProvider'
import { QueryParams, createQueryKey } from '@latitude-data/client'
import {
  UseQueryOptions,
  useQuery as useReactQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { QueryResultPayload } from '@latitude-data/query_result'

type Props = {
  queryPath: string
  params?: QueryParams
  tanstaskQueryOptions?: Omit<
    UseQueryOptions<QueryResultPayload>,
    'queryKey' | 'queryFn'
  >
}
export function useQuery({
  queryPath,
  params = {},
  tanstaskQueryOptions = { enabled: true },
}: Props) {
  const [isComputing, setComputing] = useState(false)
  const queryClient = useQueryClient()
  const { api } = useLatitude()
  const queryKeyProp = useMemo(
    () => [createQueryKey(queryPath, params)],
    [queryPath, params],
  )
  const query = useReactQuery({
    ...tanstaskQueryOptions,
    queryKey: queryKeyProp,
    queryFn: async () => api.getQuery({ queryPath, params, force: false }),
  })

  const compute = useCallback(async () => {
    setComputing(true)

    try {
      const data = await api.getQuery({ queryPath, params, force: true })
      queryClient.setQueryData(queryKeyProp, data)
    } catch {
      // Do nothing
    } finally {
      setComputing(false)
    }
  }, [queryClient, queryKeyProp])

  return {
    ...query,
    compute,
    isFetching: query.isFetching || isComputing,
  }
}
