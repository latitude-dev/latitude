import { CLI_PACKAGE_NAME } from '$src/commands/constants'
import spawn from '../spawn'

export default async function updateLatitudeCli() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('npm', ['update', '-g', CLI_PACKAGE_NAME])
    child.on('close', () => resolve())
    child.on('error', (error) => reject(error))
  })
}
