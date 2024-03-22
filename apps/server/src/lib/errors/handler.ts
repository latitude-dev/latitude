import { NotFoundError } from '@latitude-data/query_service'

export default function handleError(e: Error) {
  const isPro = import.meta.env.PROD
  const clientError = isPro ? new Error('There was an error in this query') : e as Error
  if (clientError instanceof NotFoundError) {
    return new Response(e.message, { status: 404 })
  }

  return new Response(clientError.message, { status: 500 })
}
