import config from '$src/config'
import { IncomingMessage } from 'http'
import configStore from '../configStore'
import { Readable } from 'stream'

type Options = {
  path: string
  method?: string
  data?: string
  headers?: Record<string, string>
}

const options = ({ method = 'GET', path, data, headers }: Options) => ({
  hostname: process.env.LATITUDE_SERVER_HOST || 'localhost',
  port: process.env.LATITUDE_SERVER_PORT || 3000,
  path,
  method,
  headers: {
    'Content-Type': 'application/json',
    ...(data ? { 'Content-Length': data.length } : {}),
    ...(configStore.get('jwt')
      ? { Authorization: `Bearer ${configStore.get('jwt')}` }
      : {}),
    ...headers,
  },
})

// Define a type for the callback arguments as a union of two types, one for success, one for error.
type CallbackArgs<T> = [{ err: null; res: T } | { err: Error; res: undefined }]

// Define the callback function type, utilizing the CallbackArgs type.
type Callback<T> = (...args: CallbackArgs<T>) => void

export const request = async (
  opts: Options,
  callback: Callback<{ response: IncomingMessage; responseBody: string }>,
) => {
  const req = (
    config.dev ? await import('http') : await import('https')
  ).request(options(opts), (res) => {
    let responseBody = ''

    res.on('data', (chunk) => {
      responseBody += chunk
    })

    res.on('end', () => {
      callback({ err: null, res: { response: res, responseBody } })
    })
  })

  req.on('error', (error) => {
    callback({ err: error, res: undefined })
  })

  if (opts.data) req.write(opts.data)
  req.end()

  return req
}

export const sseRequest = async (opts: Options): Promise<Readable> => {
  return new Promise((resolve, reject) => {
    const httpModule = config.dev ? import('http') : import('https')

    httpModule
      .then((module) => {
        const req = module.request(
          options({
            ...opts,
            headers: { ...opts.headers, Accept: 'text/event-stream' },
          }),
          (res) => {
            const stream = new Readable({
              read() {},
            })

            res.on('data', (chunk) => {
              stream.push(chunk)
            })

            res.on('end', () => {
              stream.push(null)
            })

            res.on('error', (error) => {
              stream.destroy(error)
            })

            resolve(stream)
          },
        )

        req.on('error', (error) => {
          reject(error) // Reject the promise on request errors
        })

        if (opts.data) req.write(opts.data)

        req.end()
      })
      .catch(reject)
  })
}
