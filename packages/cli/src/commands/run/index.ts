import { spawn } from 'child_process'
import config from '../../config'
import syncQueries from '../shared/syncQueries'

export default async function run(queryName: string, paramStrings: unknown[], watch: boolean) {
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

  await syncQueries({ watch, silent: true })
  
  const args = [
    'run',
    'query',
    watch ? '--watch' : '',
    queryName,
    JSON.stringify(params),
  ].filter(Boolean)

  const childProcess = spawn(config.pkgManager.command, args, {
    detached: false,
    cwd: config.appDir,
    stdio: 'inherit',
  })

  childProcess.on('error', (error: Error) => {
    console.error('Error running query:', error)
    process.exit(1)
  })

  childProcess.on('exit', (code: number) => {
    process.exit(code)
  })
}