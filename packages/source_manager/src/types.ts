import type { QueryConfig } from '@latitude-data/base-connector'

export class NotFoundError {
  message: string

  constructor(message: string) {
    this.message = message
  }
}

export class QueryNotFoundError extends NotFoundError {}
export class SourceFileNotFoundError extends NotFoundError {}

export interface SourceSchema {
  type: string
  details?: Record<string, unknown>
  config?: QueryConfig
}
