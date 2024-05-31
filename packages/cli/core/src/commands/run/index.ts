import config from '$src/config'
import setRootDir from '$src/lib/decorators/setRootDir'
import setup from '$src/lib/decorators/setup'
import spawn from '$src/lib/spawn'
import syncQueries from '$src/lib/sync/syncQueries'
import tracked from '$src/lib/decorators/tracked'

async function run(
  queryName: string,
  opts?: {
    param: string[] | string | undefined
    watch: boolean
    debug: boolean
  },
) {
  const watch = opts?.watch || false
  const debug = opts?.debug || false
  const params =
    typeof opts?.param === 'string' ? [opts.param] : opts?.param ?? []

  await syncQueries({ watch: true })

  const args = [
    'run',
    'query',
    queryName,
    '--',
    watch ? '--watch' : '',
    debug ? '--debug' : '',
    ...params.map((param) => `--param=${param}`),
  ].filter(Boolean)

  return spawn(
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

export default tracked('runCommand', setRootDir(setup(run)))
