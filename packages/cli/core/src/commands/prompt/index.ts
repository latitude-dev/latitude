import config from '$src/config'
import setRootDir from '$src/lib/decorators/setRootDir'
import setup from '$src/lib/decorators/setup'
import spawn from '$src/lib/spawn'
import syncQueries from '$src/lib/sync/syncQueries'
import tracked from '$src/lib/decorators/tracked'
import syncLatitudeJson from '$src/lib/sync/syncLatitudeJson'
import syncPrompts from '$src/lib/sync/syncPrompts'

async function prompt(
  promptPath: string,
  opts?: {
    param: string[] | string | undefined
    debug: boolean
  },
) {
  const debug = opts?.debug || false
  const params =
    typeof opts?.param === 'string' ? [opts.param] : opts?.param ?? []

  await syncQueries({ watch: false })
  await syncPrompts({ watch: false })
  await syncLatitudeJson({ watch: false })

  const args = [
    'run',
    'prompt',
    promptPath,
    '--',
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

export default tracked('runCommand', setRootDir(setup(prompt)))
