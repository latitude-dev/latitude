import config from '$src/config'
import { IncomingMessage } from 'http'
import { http, https } from 'follow-redirects'
import getAuthToken from '../getAuthToken'

type Options = {
  path: string
  method?: string
  data?: string
  headers?: Record<string, string>
}

class ApiError extends Error {
  status: number
  body: string

  constructor({
    body,
    statusMessage,
    status,
  }: {
    body: string
    statusMessage: string
    status: number
  }) {
    super(statusMessage)

    this.status = status
    this.body = body
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
      const httpModule = config.pro ? https : http
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
    const httpModule = config.pro ? https : http
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
