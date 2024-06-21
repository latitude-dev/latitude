import { ModelManager } from '$/manager'
import {
  CompiledPrompt,
  ModelSchema,
  PromptCompilationContext,
  PromptConfig,
  PromptRequest,
} from '$/types'
import { compile, readMetadata } from '@latitude-data/sql-compiler'
import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import buildSupportedMethods from './supportedMethods'

export type ModelProps = {
  path: string
  manager: ModelManager
  schema: ModelSchema
}

export abstract class Model {
  readonly path: string
  readonly manager: ModelManager
  readonly schema: ModelSchema

  constructor({ path, manager, schema }: ModelProps) {
    this.path = path
    this.manager = manager
    this.schema = schema
  }

  get config(): PromptConfig {
    return this.schema.config ?? {}
  }

  private async getRawPrompt(promptPath: string): Promise<string> {
    const cleanPath = promptPath.replace(/^\//, '')
    const fullPromptPath = path.resolve(
      this.manager.promptsDir,
      cleanPath.endsWith('.prompt') ? cleanPath : `${cleanPath}.prompt`,
    )

    return fs.readFileSync(fullPromptPath, 'utf8')
  }

  async compilePrompt(
    { promptPath, params }: PromptRequest,
    onDebug?: (update: string) => void,
    partialContext?: Omit<PromptCompilationContext, 'request'>,
  ): Promise<CompiledPrompt> {
    const rawPrompt = await this.getRawPrompt(promptPath)

    const context = {
      request: {
        promptPath,
        params,
      },
      ...(partialContext ?? {
        accessedParams: {},
        promptsBeingCompiled: [],
        onDebug,
      }),
    } as PromptCompilationContext

    const supportedMethods = buildSupportedMethods({ model: this, context })

    const compiledPrompt = await compile({
      query: rawPrompt,
      supportedMethods,
      resolveFn: (value: unknown) =>
        new Promise((resolve) => resolve(String(value))),
    })

    return {
      prompt: compiledPrompt,
      accessedParams: context.accessedParams,
    }
  }

  async readPromptConfig(promptPath: string): Promise<PromptConfig> {
    const rawPrompt = await this.getRawPrompt(promptPath)
    const context = {
      request: {
        promptPath,
        params: {},
      },
      accessedParams: {},
      promptsBeingCompiled: [],
    } as PromptCompilationContext
    const supportedMethods = buildSupportedMethods({ model: this, context })
    const { config } = await readMetadata({
      query: rawPrompt,
      supportedMethods,
    })
    return config
  }

  /**
   * Generates a response from the model to the given prompt.
   * @param prompt The prompt to generate a response for
   * @param config The configuration for the generation
   * @param onToken A callback to be called when each token is generated
   * @returns A string with the generated response
   */
  protected abstract generate({
    prompt,
    config,
    onToken,
  }: {
    prompt: string
    config: PromptConfig
    onToken?: (batch: string, last: boolean) => void
  }): Promise<string>

  async runPrompt({
    promptPath,
    params,
    onDebug,
    onToken,
  }: {
    promptPath: string
    params?: Record<string, unknown>
    onDebug?: (update: string) => void
    onToken?: (batch: string, last: boolean) => Promise<void>
  }): Promise<string> {
    const compiledPrompt = await this.compilePrompt(
      { promptPath, params },
      onDebug,
    )

    const promptConfig = await this.readPromptConfig(promptPath)
    const modelConfig = this.config
    const config = {
      ...modelConfig,
      ...promptConfig,
    }

    return this.generate({
      prompt: compiledPrompt.prompt,
      config,
      onToken,
    })
  }
}
