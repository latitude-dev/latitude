import { ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { EMPTY_PAYLOAD, LatitudeProvider } from '$src/data/LatitudeProvider'
import { server } from '$src/tests/setup'
import { QueryClient } from '@tanstack/react-query'
import { QueryResultPayload } from '@latitude-data/query_result'

export type KeyValue = { uid: [string, boolean]; value: unknown }

const MOCKED_HOST = 'https://latitude.mocked'
export function mockServerRequest({
  path,
  payload = EMPTY_PAYLOAD,
  status = 200,
  callback,
}: {
  path: string
  payload?: QueryResultPayload
  status?: number
  callback?: (wasForced: boolean) => void
}) {
  let wasForced = false
  server.use(
    http.get(`${MOCKED_HOST}/api/queries/${path}`, (req) => {
      const forceParam = req.request.url.match(/(?<force>__force=true)/)
      wasForced = forceParam?.groups?.force === '__force=true'
      callback?.(wasForced)
      return HttpResponse.json(payload, { status })
    }),
  )
  return wasForced
}

export function createWrapper(prevStates: KeyValue[] = []) {
  const queryClient = new QueryClient()
  prevStates.forEach(({ uid, value }) => {
    queryClient.setQueryData(uid, value)
  })

  return ({ children }: { children: ReactNode }) => (
    <LatitudeProvider apiConfig={{ host: MOCKED_HOST }}>
      {children}
    </LatitudeProvider>
  )
}

export function dummyWrapper() {
  return ({ children }: { children: ReactNode }) => <div>{children}</div>
}
