import config from '$src/config'
import setRootDir from '$src/lib/decorators/setRootDir'
import syncQueries from '$src/lib/sync/syncQueries'
import betterSpawn from '$src/lib/spawn'
import tracked from '$src/lib/decorators/tracked'
import syncLatitudeJson from '$src/lib/sync/syncLatitudeJson'

async function materialize(opts?: {
  debug: boolean
  queries: string
  force: boolean
}) {
  const debug = opts?.debug || false
  const queries = opts?.queries
  const force = opts?.force || false
  const args = [
    'run',
    'materialize_queries',
    '--',
    queries ? `--queries=${queries}` : '',
    debug ? '--debug' : '',
    force ? '--force' : '',
  ].filter(Boolean)

  await syncQueries({ watch: false })
  await syncLatitudeJson({ watch: false })
  return betterSpawn(
    'npm',
    args,
    {
      detached: false,
      cwd: config.appDir,
      stdio: 'inherit',
    },
    {
      onError: (error: Error) => {
        console.error('Error running query:', error)
        process.exit(1)
      },
      onClose: (code: number) => {
        process.exit(code)
      },
    },
  )
}

export default tracked('materializeCommand', setRootDir(materialize))
