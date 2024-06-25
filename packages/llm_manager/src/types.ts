import { Model } from './model'
export { CompileError } from '@latitude-data/sql-compiler'

export enum ModelType {
  test = 'test',
  openai = 'openai',
}

export type PromptConfig = {
  model?: string
  temperature?: number
  top_p?: number
  seed?: number
  json?: boolean
}

export type Params = {
  [key: string]: unknown
}

export type PromptRequest = {
  promptPath: string
  params?: Params
}

export type PromptCompilationContext = {
  // Requested prompt
  request: PromptRequest
  // Parameters used in the prompt
  accessedParams: Params
  // Used to detect cyclic references
  promptsBeingCompiled: string[]
  // Function to send progress updates to the user
  onDebug?: (update: string) => void
}

export type BuildSupportedMethodsArgs = {
  model: Model
  context: PromptCompilationContext
}

export type CompiledPrompt = {
  prompt: string
  accessedParams: Params
}

export class ModelError extends Error {}

export class NotFoundError extends Error {}

export class PromptNotFoundError extends NotFoundError {}
export class ModelFileNotFoundError extends NotFoundError {}

export interface ModelSchema {
  type: ModelType
  details?: Record<string, unknown>
  config?: PromptConfig
}
