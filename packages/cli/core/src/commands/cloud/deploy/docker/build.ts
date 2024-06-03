import betterSpawn from '$src/lib/spawn'

export default function buildDockerImage({
  tags,
  noCache,
  materializeQueries,
}: {
  tags: [string]
  noCache: boolean
  materializeQueries: boolean
}) {
  return new Promise<void>((resolve, reject) => {
    const args = [
      'buildx',
      'build',
      materializeQueries ? '--build-arg' : null,
      materializeQueries ? 'MATERIALIZE_QUERIES=true' : null,
      '--platform',
      'linux/amd64',
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
