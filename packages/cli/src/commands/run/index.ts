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

  await syncQueries({ watch })

  const args = [
    'run',
    'query',
    queryName,
    JSON.stringify(buildParams(opts?.param || [])),
    watch ? 'true' : 'false',
    debug ? 'true' : 'false',
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

const buildParams = (stdioParams?: string | string[]) => {
  let paramStrings: string[] = Array.isArray(stdioParams) ? stdioParams : []
  if (typeof stdioParams === 'string') paramStrings = [stdioParams]
  else if (!Array.isArray(stdioParams)) paramStrings = []

  const params: { [key: string]: unknown } = {}
  paramStrings.forEach((param) => {
    if (typeof param !== 'string') return
    const [key, value] = param.split('=')
    if (!key || !value) {
      console.error('Invalid parameter:', param)
      process.exit(1)
    }

    if (!isNaN(Number(value))) {
      params[key] = Number(value)
      return
    }

    if (value === 'true' || value === 'false') {
      params[key] = value === 'true'
      return
    }

    params[key] = value
  })

  return params
}

export default tracked('runCommand', setRootDir(setup(run)))
