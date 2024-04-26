import chalk from 'chalk'
import { writeFileSync } from 'fs'
import dockerfileTemplate from '../../templates/Dockerfile'
import dockerignoreTemplate from '../../templates/dockerignore.template'

export function writeFile({
  type,
  path,
}: {
  type: 'dockerfile' | 'dockerignore'
  path: string
}) {
  const template =
    type === 'dockerfile' ? dockerfileTemplate() : dockerignoreTemplate
  try {
    writeFileSync(path, template)
  } catch (e) {
    console.log(chalk.red(`Failed to write ${type} to ${path}`))

    process.exit(1)
  }
}
