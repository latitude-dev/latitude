import { NotFoundError } from '@latitude-data/source-manager'

export function handleQueryError(e: Error) {
  const isProd = import.meta.env.PROD
  const clientError = isProd
    ? new Error('There was an error in this query')
    : (e as Error)
  if (clientError instanceof NotFoundError) {
    return new Response(e.message, { status: 404 })
  }

  // TODO: Add sentry reporting
  console.error(e)

  return new Response(clientError.message, { status: 500 })
}

export function handlePromptError(e: Error) {
  // TODO: Add sentry reporting
  console.error(e)

  const isProd = import.meta.env.PROD
  if (!isProd) return e
  return new Error('There was an error running this prompt')
}
