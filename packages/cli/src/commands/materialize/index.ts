import config from '$src/config'
import setRootDir from '$src/lib/decorators/setRootDir'
import syncQueries from '$src/lib/sync/syncQueries'
import betterSpawn from '$src/lib/spawn'
import tracked from '$src/lib/decorators/tracked'

async function materialize(opts?: { debug: boolean; queries: string }) {
  const debug = opts?.debug || false
  const queries = opts?.queries
  const args = [
    'run',
    'materialize_queries',
    '--',
    queries ? `--queries=${queries}` : '',
    debug ? '--debug' : '',
  ].filter(Boolean)

  await syncQueries({ watch: false })
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
