import config from '$src/config'
import assertLatitudeProject from '$src/lib/decorators/assertLatitudeProject'
import setup from '$src/lib/decorators/setup'
import tracked from '$src/lib/decorators/tracked'
import spawn from '$src/lib/spawn'
import syncQueries from '$src/lib/sync/syncQueries'

async function run(
  queryName: string,
  opts?: { param: string[] | string | undefined; watch: boolean },
) {
  const watch = opts?.watch || false

  await syncQueries({ watch })

  const args = [
    'run',
    'query',
    watch ? '--watch' : '',
    queryName,
    JSON.stringify(buildParams(opts?.param || [])),
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

export default tracked('runCommand', assertLatitudeProject(setup(run)))
