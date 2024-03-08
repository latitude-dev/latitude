import { NotFoundError } from '.'

export default function handleError(e: Error) {
  if (e instanceof NotFoundError) {
    return new Response(e.message, { status: 404 })
  }

  return new Response(e.message, { status: 500 })
}
