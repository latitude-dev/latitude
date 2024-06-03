import chalk from 'chalk'
import config from '$src/config'
import { IncomingMessage } from 'http'
import { http, https } from 'follow-redirects'
import getAuthToken from '../getAuthToken'
import boxedMessage from '$src/lib/boxedMessage'

type Options = {
  path: string
  method?: string
  data?: string
  headers?: Record<string, string>
}

function safeDetailsParse(str: string) {
  try {
    const body = JSON.parse(str)
    const details = body.details ?? {}
    const error = body.error
    return { error, details }
  } catch {
    return { error: null, details: {} }
  }
}

export class ApiError extends Error {
  status: number
  body: string
  private details: Record<string, string[]> = {}
  private errorMessage: string

  constructor({
    body,
    statusMessage,
    status,
  }: {
    body: string
    statusMessage: string
    status: number
  }) {
    const { error, details } = safeDetailsParse(body)
    const errorMessage = error ?? statusMessage
    super(errorMessage)

    this.status = status
    this.body = body
    this.details = details
    this.errorMessage = errorMessage
  }

  displayErrorDetails({ message }: { message: string }) {
    const errorKeys = Object.keys(this.details)
    if (errorKeys.length === 0) {
      console.error(chalk.red(message, this.message))
    } else {
      let allErrors = `
${this.errorMessage}
----------------\n
`
      errorKeys.forEach((key) => {
        console.error(chalk.red(`  ${key}:`))
        const messages = this.details[key] ?? []
        const errorMessage = messages[0]
        if (errorMessage) {
          allErrors += `${key}: ${errorMessage}\n`
        }
      })
      boxedMessage({
        text: allErrors,
        title: message,
        color: 'red',
      })
    }
  }
}

const options = ({ method = 'GET', path, headers }: Options) => {
  const token = getAuthToken()

  return {
    hostname: process.env.LATITUDE_SERVER_HOST || 'localhost',
    port: process.env.LATITUDE_SERVER_PORT
      ? parseInt(process.env.LATITUDE_SERVER_PORT)
      : 3000,
    path,
    method,
    maxRedirects: 20,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }
}

export const request = (opts: Options) => {
  return new Promise<{ response: IncomingMessage; body: string }>(
    (resolve, reject) => {
      const httpModule = config.prod ? https : http
      const req = httpModule.request(options(opts), (res: IncomingMessage) => {
        let body = ''

        res.on('data', (chunk: unknown) => {
          body += chunk
        })

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ response: res, body })
          } else {
            reject(
              new ApiError({
                body,
                statusMessage: res.statusMessage!,
                status: res.statusCode!,
              }),
            )
          }
        })
      })

      req.on('error', (error: Error) => {
        reject(error)
      })

      if (opts.data) req.write(opts.data)
      req.end()

      return req
    },
  )
}

export const sseRequest = (opts: Options): Promise<IncomingMessage> => {
  return new Promise((resolve, reject) => {
    const httpModule = config.prod ? https : http
    const req = httpModule.request(
      options({
        ...opts,
        headers: { ...opts.headers, Accept: 'text/event-stream' },
      }),
      (res: IncomingMessage) => {
        resolve(res)
      },
    )

    req.on('error', (error: Error) => {
      reject(error)
    })

    if (opts.data) req.write(opts.data)

    req.end()
  })
}
