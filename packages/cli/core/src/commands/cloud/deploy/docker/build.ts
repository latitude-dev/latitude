import betterSpawn from '$src/lib/spawn'
import createDockerfile from './createDockerfile'

export default function buildDockerImage({
  tags,
  noCache,
}: {
  tags: [string]
  noCache: boolean
}) {
  return new Promise<void>((resolve, reject) => {
    const dockerfilePath = createDockerfile()
    const args = [
      'buildx',
      'build',
      '--platform',
      'linux/amd64',
      '--file',
      dockerfilePath,
      '-t',
      tags[0],
      '.',
    ].filter((a) => a !== null) as string[]

    if (noCache) args.push('--no-cache')

    betterSpawn(
      'docker',
      args,
      {
        stdio: 'inherit',
      },
      {
        onClose: (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Build process exited with code ${code}`))
          }
        },
      },
    )
  })
}
