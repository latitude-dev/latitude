import { JSX, useContext, ReactNode, createContext } from 'react'
import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'
import { LatitudeApi } from '@latitude-data/client'

type ILatitude = { api: LatitudeApi }
const LatitudeContext = createContext<ILatitude>({ api: new LatitudeApi() })

import { LatitudeApiConfig } from '@latitude-data/client'

export const EMPTY_PAYLOAD = {
  fields: [],
  rows: [],
  rowCount: 0,
}
export const useLatitude = () => {
  const latitude = useContext(LatitudeContext)

  if (!latitude) {
    throw new Error('No LatitudeProvider found. Make sure to wrap your component with LatitudeProvider.')
  }

  return latitude
}

export type QueryClientProviderProps = {
  apiConfig: LatitudeApiConfig
  children: ReactNode
  defaultTanstackQueryOptions?: QueryClientConfig['defaultOptions']
}

export function LatitudeProvider({
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
      <LatitudeContext.Provider value={{ api: new LatitudeApi(apiConfig) }}>
        {children}
      </LatitudeContext.Provider>
    </QueryClientProvider>
  )
}
