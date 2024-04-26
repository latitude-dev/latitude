import chalk from 'chalk'
import config from '$src/config'
import path from 'path'
import { existsSync } from 'fs'
import { writeFile } from './_shared'

function addDockerignore(force = false) {
  const dockerignorePath = path.resolve(config.rootDir, '.dockerignore')
  if (!force && existsSync(dockerignorePath)) {
    console.log(
      chalk.yellow(
        'Dockerignore file already exists. Run latitude update --force to update it.',
      ),
    )
    return
  }

  writeFile({ type: 'dockerignore', path: dockerignorePath })
}

function addDockerfile(force = false) {
  const dockerfilePath = path.resolve(config.rootDir, 'Dockerfile')
  if (!force && existsSync(dockerfilePath)) {
    console.log(
      chalk.yellow(
        'Dockerfile file already exists. Run latitude update --force to update it.',
      ),
    )
    return
  }

  writeFile({ type: 'dockerfile', path: dockerfilePath })
}

export function addDockerfiles(
  { force = false }: { force: boolean } = { force: false },
) {
  addDockerignore(force)
  addDockerfile(force)
}
