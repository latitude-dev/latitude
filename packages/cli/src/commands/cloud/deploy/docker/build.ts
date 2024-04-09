import betterSpawn from '$src/lib/spawn'

export default function buildDockerImage({
  tags,
  noCache,
}: {
  tags: [string]
  noCache: boolean
}) {
  return new Promise<void>((resolve, reject) => {
    const args = [
      'buildx',
      'build',
      '--platform',
      'linux/amd64',
      '-t',
      tags[0],
      '.',
    ]
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
