import QueryResult from '@latitude-data/query_result'
import { useEffect, useState } from 'react'
import { useQuery } from '$src/data'

export default function useQueryWithPersistentData(
  args: Parameters<typeof useQuery>[0],
) {
  const {
    data: incoming,
    isFetching: isLoading,
    error,
    download: downloadFn,
  } = useQuery(args)

  const [data, setData] = useState(incoming ? new QueryResult(incoming) : null)

  useEffect(() => {
    if (isLoading) return
    if (!isLoading && incoming) {
      setData(new QueryResult(incoming))
    }
  }, [isLoading, setData, incoming])

  return {
    data,
    isLoading,
    error,
    download: downloadFn,
  }
}
