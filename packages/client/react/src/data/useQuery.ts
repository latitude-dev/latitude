import { useCallback, useMemo, useState } from 'react'
import { useLatitude } from '$src/data/ApiProvider'
import { QueryParams, createQueryKey } from '@latitude-data/client'
import {
  UseQueryOptions,
  useQuery as useReactQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { QueryResultPayload } from '@latitude-data/query_result'

export type QueryRequestProps = {
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
}: QueryRequestProps) {
  const [isComputing, setComputing] = useState(false)
  const [isDownloading, setDownloading] = useState(false)
  const queryClient = useQueryClient()
  const { api } = useLatitude()
  const queryKeyProp = useMemo(
    () => [createQueryKey(queryPath, params)],
    [queryPath, params],
  )
  const query = useReactQuery({
    ...tanstaskQueryOptions,
    queryKey: queryKeyProp,
    queryFn: async () => api.getQuery({ queryPath, params }),
  })

  const compute = useCallback(async () => {
    setComputing(true)

    try {
      const data = await api.getQuery({ queryPath, params, force: true })
      queryClient.setQueryData(queryKeyProp, data)
    } catch (e) {
      console.error(e)
    } finally {
      setComputing(false)
    }
  }, [api, queryClient, queryKeyProp, queryPath, params])

  const download = useCallback(
    async ({ force = false }: { force?: boolean } = { force: false }) => {
      setDownloading(true)

      try {
        await api.downloadQuery({
          queryPath,
          params: { ...params, __force: force },
        })
      } catch (e) {
        console.error(e)
      } finally {
        setDownloading(false)
      }
    },
    [api, queryPath, params],
  )

  return {
    ...query,
    compute,
    download,
    isDownloading,
    isFetching: query.isFetching || isComputing,
  }
}
