const dev = require('./dev.cjs')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

let ok = false

spawnSync('node', [path.join(__dirname, '../../dist/cli.js'), 'telemetry', '--disable'])

const spawned = spawn('node', [
  path.join(__dirname, '../../dist/cli.js'),
  'start',
  '--name',
  'test-project',
  '--template',
  'default',
  '--telemetry',
  'false',
  '--debug'
])

spawned.stdout.pipe(process.stdout)
spawned.stderr.pipe(process.stderr)
spawned.on('close', function (code) {
  if (code !== 0) process.exit(code)

  ok = true

  dev()
})

spawned.on('error', function (error) {
  console.error('Error! ', error)

  process.exit(1)
})

setTimeout(() => {
  if (ok) return

  console.log('Timeout reached, killing the process...')

  spawned.kill()
  process.exit(1)
}, 60000)
