const run = require('./run.cjs')
const dev = require('./dev.cjs')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

let ok = false

// Disable telemetry
spawnSync(
  'node',
  [
    path.join(__dirname, '../../dist/cli.js'),
    'telemetry',
    '--disable'
  ]
)

const spawned = spawn('node', [
  path.join(__dirname, '../../dist/cli.js'),
  'start',
  '--name',
  'test-project',
  '--template',
  'default',
  '--verbose'
], { stdio: 'inherit' })

spawned.on('close', async (code) => {
  if (code !== 0) process.exit(code)

  ok = true

  try {
    await dev()
    await run()
  } catch (error) {
    console.error(error)

    process.exit(1)
  }

  process.exit()
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
