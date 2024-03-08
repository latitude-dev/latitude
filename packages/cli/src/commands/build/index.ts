import colors from 'picocolors'
import config from '../../config'
import fsExtra from 'fs-extra'
import path from 'path'
import syncQueries from '../shared/syncQueries'
import syncViews from '../shared/syncViews'
import { APP_FOLDER } from '../constants'
import { configDotenv } from 'dotenv'
import { onError } from '../../utils'
import { spawn } from 'child_process'

const { Select } = require('enquirer')

configDotenv()

export const adapters = [
  {
    name: 'vercel',
    command: { VERCEL: 'true' },
  },
  {
    name: 'cloudflare',
    command: { CF_PAGES: 'true' },
  },
  {
    name: 'netlify',
    command: { NETLIFY: 'true' },
  },
  {
    name: 'aws',
    command: { SST: 'true' },
  },
]

async function targetEnv(target: string | undefined) {
  let _target = target
  if (!target) {
    const prompt = new Select({
      name: 'target',
      message: 'Pick a target',
      choices: adapters.map((adapter) => adapter.name),
    })

    try {
      _target = await prompt.run()
    } catch (e) {
      onError({ error: e as Error, message: 'Error selecting target' })
    }
  }

  const adapter = adapters.find((adapter) =>
    adapter.name.includes(_target as string),
  )

  if (!adapter) {
    return onError({
      error: new Error('Invalid target specified'),
      message: `Invalid target specified: ${target}`,
    })
  }

  return adapter.command
}

export default async function build({
  target = process.env.LATITUDE_TARGET, // TODO: When we have latitude.json, use that instead
}: {
  target: string | undefined
}) {
  const cwd = config.cwd
  const appName = path.basename(cwd)

  await syncViews({ dataAppDir: cwd, appName, watch: true })
  await syncQueries({ rootDir: cwd, watch: true })

  const buildCwd = path.join(cwd, APP_FOLDER)
  const env = {
    ...process.env,
    ...(await targetEnv(target)),
  }
  console.log(buildCwd, env)
  const buildProcess = spawn(config.pkgManager.command, ['run', 'build'], {
    detached: false,
    cwd: buildCwd,
    env,
  })

  buildProcess.stdout?.on('data', (data) => {
    console.log(colors.gray(data))
  })

  buildProcess.stderr?.on('data', (data) => {
    if (data.includes('WARNING')) return // ignore warnings

    console.error(colors.yellow(data))
  })

  buildProcess.on('error', (err) => {
    onError({
      error: err,
      message: `Error running build process for ${target}`,
    })
  })

  buildProcess.on('close', (code) => {
    if (code && code !== 0) {
      console.error(colors.red(`Build failed with code ${code}`))
      process.exit(code)
    }

    // Copy contents from buildCwd /dist to cwd /dist
    const distPath = path.join(cwd, 'build')
    const buildDistPath = path.join(buildCwd, 'build')

    // ensure distPath exists
    fsExtra.ensureDirSync(distPath)

    // clean distPath before copying
    fsExtra.emptyDirSync(distPath)

    // copy buildDistPath to distPath
    fsExtra.copySync(buildDistPath, distPath)

    console.log(colors.green(`📦 Build completed for ${target}`))

    process.exit()
  })
}
