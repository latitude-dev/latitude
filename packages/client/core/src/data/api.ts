type AnyObject = Record<string, unknown>
type ApiErrorItem = { title: string; detail: string }
type ApiErrorBody = {
  errors: ApiErrorItem[]
}

type LatitudeApiConfig = {
  host?: string
  cors?: RequestMode
  customHeaders?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public json: ApiErrorBody,
  ) {
    super(message)
  }
}

class LatitudeApi {
  private host: string = ''
  private cors: RequestMode = 'cors'
  private customHeaders: Record<string, string> = {}

  configure({ host, cors, customHeaders }: LatitudeApiConfig) {
    if (host !== undefined) this.host = host
    if (cors !== undefined) this.cors = cors
    if (customHeaders) this.customHeaders = customHeaders
  }

  async get<T>(
    urlStr: string,
    params: AnyObject = {},
    additionalHeaders: Record<string, string> = {},
  ): Promise<T> {
    const url = this.buildUrl(`${urlStr}`, params)
    const init = {
      method: 'GET',
      headers: this.buildHeaders({
        customHeaders: { ...this.customHeaders, ...additionalHeaders },
      }),
      mode: this.cors,
    } as RequestInit
    return await this.request(async () => {
      const res = await globalThis.window.fetch(url.href, init)
      return this.handleResponse<T>(res)
    })
  }

  private buildUrl(urlStr: string, params: AnyObject = {}) {
    if (!this.host)
      throw new ApiError('API host not configured', 500, {
        errors: [{ title: 'API error', detail: 'API host not configured' }],
      })

    const url = new URL(`${this.host}/${urlStr}`)
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]!.toString()),
    )

    return url
  }

  private buildHeaders({
    customHeaders,
  }: {
    data?: AnyObject
    customHeaders: Record<string, string>
  }): HeadersInit {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')

    Object.keys(customHeaders).forEach((key) =>
      headers.append(key, customHeaders[key]!),
    )

    return headers
  }

  private request<T>(fn: () => Promise<T>) {
    try {
      return fn()
    } catch (e) {
      if (e instanceof ApiError) throw e

      throw new ApiError('Unexpected API error', 500, {
        errors: [{ title: 'API error', detail: 'Unexpected API error' }],
      })
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) return response.json()

    let json: ApiErrorBody = { errors: [] }
    if (response.status >= 500) {
      json = {
        errors: [{ title: 'API error', detail: await response.text() }],
      } as ApiErrorBody
    } else {
      try {
        json = await response.json()
      } catch (e) {
        console.error('Error parsing JSON', e)

        json = {
          errors: [{ title: 'API error', detail: 'Unexpected API error' }],
        }
      }
    }

    throw new ApiError(response.statusText, response.status, json)
  }
}

export const api = new LatitudeApi()
