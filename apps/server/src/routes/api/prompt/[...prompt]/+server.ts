import { handlePromptError } from '$lib/errors/handler'
import modelManager from '$lib/server/modelManager'
import { NotFoundError } from '@latitude-data/source-manager'
import getPromptParams from '../../queries/[...query]/getQueryParams'

type Props = { params: { prompt?: string }; url: URL }
export async function GET({ params: args, url }: Props) {
  try {
    const { params, stream } = await getPromptParams(url)
    const prompt = args.prompt ?? ''

    const model = await modelManager.loadFromPrompt(prompt)

    if (!stream) {
      const response = await model.runPrompt({ promptPath: prompt, params })
      return new Response(response, {
        headers: {
          'Content-Type': 'text/plain',
        },
        status: 200,
      })
    }

    const encoder = new TextEncoder()
    let closed = false
    const readableStream = new ReadableStream({
      cancel() {
        // Connection was cancelled
        closed = true
      },
      start(controller) {
        const send = (type: string, data: { [key: string]: string }) => {
          controller.enqueue(encoder.encode(`event: ${type}\n`))
          Object.entries(data).forEach(([key, value]) => {
            value.split('\n').forEach((val) => {
              controller.enqueue(encoder.encode(`${key}: ${val}\n`))
            })
          })
          controller.enqueue(encoder.encode('\n'))
        }

        model
          .runPrompt({
            promptPath: prompt,
            params,
            onToken: (chunk: string) => send('message', { data: chunk }),
          })
          .then(() => {
            send('done', { data: '' })
          })
          .catch((e: Error) => {
            const error = handlePromptError(e as Error)
            console.log('- ERROR:', error.message)
            send('error', { data: error.message })
          })
          .finally(() => {
            if (closed) return
            closed = true
            controller.close()
          })
      },
    })
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (e) {
    const error = handlePromptError(e as Error)
    const status = error instanceof NotFoundError ? 404 : 500
    return new Response(error.message, { status })
  }
}
