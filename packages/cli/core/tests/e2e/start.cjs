const dev = require('./dev.cjs')
const path = require('path')
const { spawn } = require('child_process')

let ok = false

const spawned = spawn('node', [
  path.join(__dirname, '../../dist/cli.js'),
  'start',
  '--name',
  'test-project',
  '--template',
  'default',
  '--verbose',
  '--tty',
  false
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
}, 180000)
