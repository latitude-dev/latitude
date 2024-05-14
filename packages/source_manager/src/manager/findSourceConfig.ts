import * as fs from 'fs'
import path from 'path'
import { SourceFileNotFoundError, QueryNotFoundError } from '@/types'

export default function findSourceConfigFromQuery({
  query,
  queriesDir,
}: {
  query: string
  queriesDir: string
}) {
  const fullPath = path.join(
    queriesDir,
    query.endsWith('.sql') ? query : `${query}.sql`,
  )

  if (!fs.existsSync(fullPath)) {
    throw new QueryNotFoundError(`Query file not found at ${fullPath}`)
  }

  try {
    fs.accessSync(fullPath)
  } catch (e) {
    throw new QueryNotFoundError(`Query file not found at ${fullPath}`)
  }

  // Start from the directory of the .sql file and iterate upwards.
  let currentDir = path.dirname(fullPath)

  while (currentDir.includes(queriesDir)) {
    // Stop if the root directory is reached
    // Try to find a .yml file in the current directory
    const files = fs.readdirSync(currentDir)
    const ymlFile = files?.find(
      (file) => file.endsWith('.yml') || file.endsWith('.yaml'),
    )

    if (ymlFile) {
      // Assume a YML file is the source configuration file
      return path.join(currentDir, ymlFile)
    }

    // Move up one directory
    currentDir = path.dirname(currentDir)
  }

  throw new SourceFileNotFoundError(`Source file not found at ${fullPath}`)
}
