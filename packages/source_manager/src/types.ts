import { QueryConfig } from '@/baseConnector'
import { ConnectorType } from '@/baseConnector/connectorFactory'

export class NotFoundError extends Error {
  message: string

  constructor(message: string) {
    super(message)
    this.message = message
  }
}

export class QueryNotFoundError extends NotFoundError {}
export class SourceFileNotFoundError extends NotFoundError {}

export interface SourceSchema {
  type: ConnectorType
  details?: Record<string, unknown>
  config?: QueryConfig
}
