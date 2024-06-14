import config from '$src/config'
import path from 'path'
import { existsSync } from 'fs'
import { writeFile } from './_shared'

export function addDockerignore() {
  const dockerignorePath = path.resolve(config.rootDir, '.dockerignore')
  if (existsSync(dockerignorePath)) return

  writeFile({ type: 'dockerignore', path: dockerignorePath })
}

function addDockerfile() {
  const dockerfilePath = path.resolve(config.rootDir, 'Dockerfile')
  if (existsSync(dockerfilePath)) return

  writeFile({ type: 'dockerfile', path: dockerfilePath })
}

export function addDockerfiles() {
  addDockerignore()
  addDockerfile()
}
