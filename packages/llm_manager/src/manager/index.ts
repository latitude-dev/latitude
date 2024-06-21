import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import findModelConfigFromPrompt from './findModelConfig'
import {
  PromptNotFoundError,
  ModelFileNotFoundError,
  ModelType,
  ModelError,
} from '$/types'
import { Model } from '$/model'
import readModelConfig from '$/model/readConfig'
import { SourceManager } from '@latitude-data/source-manager'
import OpenAIModel from '$/model/models/openai'
import TestModel from '$/model/models/test'

export class ModelManager {
  private instances: Record<string, Model> = {}
  readonly promptsDir: string
  readonly sourceManager: SourceManager

  constructor(promptsDir: string, sourceManager: SourceManager) {
    this.promptsDir = promptsDir
    this.sourceManager = sourceManager
  }

  /**
   * Finds the model configuration file in the given path and loads it
   * @param path - The path to any file in the model directory.
   * This could be the model configuration file itself or any other prompt in the directory.
   */
  async loadFromPrompt(prompt: string): Promise<Model> {
    const filePath = path.join(
      this.promptsDir,
      prompt.endsWith('.prompt') ? prompt : `${prompt}.prompt`,
    )

    if (!filePath.includes(this.promptsDir)) {
      throw new ModelFileNotFoundError(
        `Prompt file is not in the prompts directory: ${filePath}`,
      )
    }

    if (!fs.existsSync(filePath)) {
      throw new PromptNotFoundError(`Prompt file not found at ${filePath}`)
    }

    const modelFilePath = findModelConfigFromPrompt({
      prompt,
      promptsDir: this.promptsDir,
    })

    const modelPath = path.relative(
      this.promptsDir,
      path.dirname(modelFilePath),
    )

    if (!this.instances[modelPath]) {
      this.buildModel({ modelPath, modelFile: modelFilePath })
    }

    return this.instances[modelPath]!
  }

  /**
   * Loads a model from a model configuration file
   * @param modelFile - The path to the model configuration file
   */
  async loadFromConfigFile(modelFile: string): Promise<Model> {
    if (!path.isAbsolute(modelFile)) {
      modelFile = path.join(this.promptsDir, modelFile)
    }

    if (!fs.existsSync(modelFile)) {
      throw new ModelFileNotFoundError(`Model file not found at ${modelFile}`)
    }

    // If the given path is not in promptsDir, throw an error
    if (!modelFile.includes(this.promptsDir)) {
      throw new ModelFileNotFoundError(
        `Model file is not in the prompts directory: ${modelFile}`,
      )
    }

    const modelPath = path.relative(this.promptsDir, path.dirname(modelFile))
    if (!this.instances[modelPath]) {
      this.buildModel({ modelPath, modelFile })
    }

    return this.instances[modelPath]!
  }

  private buildModel({
    modelFile,
    modelPath,
  }: {
    modelFile: string
    modelPath: string
  }) {
    const schema = readModelConfig(modelFile)
    const type = schema.type

    switch (type) {
      case ModelType.test:
        this.instances[modelPath] = new TestModel({
          path: modelPath,
          schema,
          manager: this,
        })
        break
      case ModelType.openai:
        this.instances[modelPath] = new OpenAIModel({
          path: modelPath,
          schema,
          manager: this,
        })
        break
      default:
        throw new ModelError(`Unsupported model type: ${type}`)
    }
  }
}
