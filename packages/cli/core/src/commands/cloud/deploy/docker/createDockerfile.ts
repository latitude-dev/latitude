import path from 'path'
import chalk from 'chalk'
import { writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import { DockerfileCloudTemplate } from './DockerfileTemplate'
import config from '$src/config'
import { addDockerignore } from '$src/lib/addDockerfiles/fromSetup'

export default function createDockerfile() {
  addDockerignore()
  ensureDirSync(config.cloudDir)
  const dockerfilePath = path.resolve(config.cloudDir, 'Dockerfile')
  const template = DockerfileCloudTemplate()
  try {
    writeFileSync(dockerfilePath, template)
    return dockerfilePath
  } catch (e) {
    console.log(chalk.red(`Failed to write Dockerfile to ${dockerfilePath}`))

    process.exit(1)
  }
}
