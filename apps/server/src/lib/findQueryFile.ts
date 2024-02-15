import * as fs from 'fs/promises'
import * as path from 'path'

export const ROOT_FOLDER = 'static/latitude/queries'

type Result = {
  queryPath: string
  sourcePath: string
}

export class QueryNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QueryNotFoundError'
  }
}

export class SourceFileNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SourceFileNotFoundError'
  }
}

export default async function findQueryFile(filePath: string): Promise<Result> {
  let sourcePath
  let queryPath = path.join(ROOT_FOLDER, filePath) + '.sql'

  try {
    await fs.access(queryPath)
  } catch (err) {
    throw new QueryNotFoundError(`Query file not found at ${filePath}`)
  }

  // Start from the directory of the .sql file and iterate upwards.
  let currentDir = path.dirname(queryPath)

  while (currentDir.includes(ROOT_FOLDER)) {
    // Stop if the root directory is reached
    // Try to find a .yml file in the current directory
    const files = await fs.readdir(currentDir)
    const ymlFile = files.find(
      (file) => file.endsWith('.yml') || file.endsWith('.yaml')
    )

    if (ymlFile) {
      sourcePath = path.join(currentDir, ymlFile)
      break // YML file found, break out of the loop
    }

    currentDir = path.dirname(currentDir)
  }

  if (sourcePath) {
    return {
      queryPath: path.relative(path.dirname(sourcePath), queryPath),
      sourcePath,
    }
  } else {
    throw new SourceFileNotFoundError('Source file not found')
  }
}
