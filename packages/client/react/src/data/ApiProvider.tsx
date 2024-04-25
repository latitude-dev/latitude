import { JSX, useContext, ReactNode, createContext } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query'
import { LatitudeApi } from '@latitude-data/client'

type ILatitude = { api: LatitudeApi }
const ApiContext = createContext<ILatitude>({ api: new LatitudeApi() })

import { LatitudeApiConfig } from '@latitude-data/client'
import { Field, ResultRow } from '@latitude-data/query_result'

const EMPTY_PAYLOAD = {
  fields: [] as Field[],
  rows: [] as ResultRow[],
  rowCount: 0,
}
export const useLatitude = () => {
  const latitude = useContext(ApiContext)

  if (!latitude) {
    throw new Error(
      'No LatitudeProvider found. Make sure to wrap your component with LatitudeProvider.',
    )
  }

  return latitude
}

type QueryClientProviderProps = {
  apiConfig: LatitudeApiConfig
  defaultTanstackQueryOptions?: QueryClientConfig['defaultOptions']
  children: ReactNode
}

function LatitudeApiProvider({
  apiConfig,
  defaultTanstackQueryOptions,
  children,
}: QueryClientProviderProps): JSX.Element {
  const queriesConfig = defaultTanstackQueryOptions?.queries || {}
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: true,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        staleTime: Infinity,
        refetchOnReconnect: 'always',
        refetchOnMount: false,
        notifyOnChangeProps: 'all',
        placeholderData: EMPTY_PAYLOAD,
        ...queriesConfig,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={{ api: new LatitudeApi(apiConfig) }}>
        {children}
      </ApiContext.Provider>
    </QueryClientProvider>
  )
}

export {
  EMPTY_PAYLOAD,
  ApiContext,
  LatitudeApiProvider,
  type QueryClientProviderProps,
}
