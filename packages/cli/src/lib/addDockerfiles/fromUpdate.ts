import config from '$src/config'
import path from 'path'
import { writeFile } from './_shared'

function addDockerignore() {
  const dockerignorePath = path.resolve(config.rootDir, '.dockerignore')

  writeFile({ type: 'dockerignore', path: dockerignorePath })
}

function addDockerfile() {
  const dockerfilePath = path.resolve(config.rootDir, 'Dockerfile')

  writeFile({ type: 'dockerfile', path: dockerfilePath })
}

export function addDockerfiles() {
  addDockerignore()
  addDockerfile()
}
