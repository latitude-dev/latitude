import { format } from '@latitude-data/custom_types'
import { QueryParams } from '../stores/queries'
import {
  DOWNLOAD_PARAM,
  FORCE_REFETCH_PARAM,
  PRIVATE_PARAMS,
} from '../constants'
import { QueryResultPayload } from '@latitude-data/query_result'

type AnyObject = { [key: string]: unknown }
type ApiErrorItem = { title: string; detail: string }

export type LatitudeApiConfig = {
  host?: string
  cors?: RequestMode
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export class LatitudeApi {
  private host?: string
  private cors: RequestMode = 'cors'

  static buildParams(params: AnyObject): string {
    return Object.entries(params)
      .map(([key, value]) => {
        if (PRIVATE_PARAMS.has(key)) return `${key}=${value}`

        return `${key}=${format(value)}`
      })
      .join('&')
  }

  constructor({ host, cors }: LatitudeApiConfig = {}) {
    if (host !== undefined) this.host = host
    if (cors !== undefined) this.cors = cors
  }

  async getQuery({
    queryPath,
    params = {},
    force = false,
  }: {
    queryPath: string
    params?: QueryParams
    force?: boolean
  }): Promise<QueryResultPayload> {
    if (force) params[FORCE_REFETCH_PARAM] = true

    return this.get(`api/queries/${queryPath}`, params).then(
      this.handleRegularResponse,
    )
  }

  async downloadQuery({
    queryPath,
    params = {},
    force = false,
  }: {
    queryPath: string
    params?: QueryParams
    force?: boolean
  }) {
    return this.get(
      `api/queries/${queryPath}`,
      {
        ...params,
        [FORCE_REFETCH_PARAM]: force,
        [DOWNLOAD_PARAM]: true,
      },
      {
        Accept: 'text/csv',
        ContentType: 'text/csv',
      },
    )
      .then((res) => this.handleDownloadResponse(queryPath, res))
      .catch((error) => {
        throw new ApiError(error.message, 500)
      })
  }

  private async get(
    urlStr: string,
    params: AnyObject = {},
    headers: Record<string, string> = DEFAULT_HEADERS,
  ) {
    return globalThis.window.fetch(this.buildUrl(`${urlStr}`, params).href, {
      method: 'GET',
      headers: this.buildHeaders(headers),
      mode: this.cors,
    })
  }

  private buildUrl(urlStr: string, params: AnyObject = {}): URL {
    const url = new URL(`${this.safeHost}/${urlStr}`)
    const formattedParams = LatitudeApi.buildParams(params)
    url.search = formattedParams

    return url
  }

  private get safeHost() {
    return this.host ?? globalThis.location.origin
  }

  private buildHeaders(headers: Record<string, string> = DEFAULT_HEADERS) {
    const h = new Headers()

    Object.keys(headers).forEach((key) => h.append(key, headers[key]!))

    return headers
  }

  private async handleDownloadResponse(name: string, response: Response) {
    try {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = globalThis.document.createElement('a')
      a.href = url
      a.download = `${name}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      throw new ApiError((error as Error).message, 500)
    }
  }

  private async handleRegularResponse(response: Response) {
    if (response.ok) return response.json() as Promise<QueryResultPayload>

    let errorMessage = 'Unexpected API error'
    try {
      const contentType = response.headers.get('Content-Type')

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json()
        if (json.errors) {
          errorMessage = json.errors
            .map((e: ApiErrorItem) => e.detail)
            .join(', ')
        }
      } else {
        const text = await response.text()
        errorMessage = text
      }
    } catch {
      errorMessage = 'Error parsing API response'
    }

    throw new ApiError(errorMessage, response.status)
  }
}

export const api = new LatitudeApi()
