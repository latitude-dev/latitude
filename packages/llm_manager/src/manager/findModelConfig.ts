import * as fs from 'fs'
import path from 'path'
import { ModelFileNotFoundError, PromptNotFoundError } from '$/types'

export default function findModelConfigFromPrompt({
  prompt,
  promptsDir,
}: {
  prompt: string
  promptsDir: string
}) {
  const fullPath = path.join(
    promptsDir,
    prompt.endsWith('.prompt') ? prompt : `${prompt}.prompt`,
  )

  if (!fs.existsSync(fullPath)) {
    throw new PromptNotFoundError(`Prompt file not found at ${fullPath}`)
  }

  try {
    fs.accessSync(fullPath)
  } catch (e) {
    throw new PromptNotFoundError(`Prompt file not found at ${fullPath}`)
  }

  // Start from the directory of the .prompt file and iterate upwards.
  let currentDir = path.dirname(fullPath)

  while (currentDir.includes(promptsDir)) {
    // Stop if the root directory is reached
    // Try to find a .yml file in the current directory
    const files = fs.readdirSync(currentDir)
    const ymlFile = files?.find(
      (file) => file.endsWith('.yml') || file.endsWith('.yaml'),
    )

    if (ymlFile) {
      // Assume a YML file is the model configuration file
      return path.join(currentDir, ymlFile)
    }

    // Move up one directory
    currentDir = path.dirname(currentDir)
  }

  throw new ModelFileNotFoundError(`Model file not found at ${fullPath}`)
}
