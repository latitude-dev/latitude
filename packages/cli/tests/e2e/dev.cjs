const { spawn } = require('child_process')
const path = require('path')

function dev () {
  const spawned = spawn('node', [
    path.join(__dirname, '../../dist/cli.js'),
    'dev',
    '--open',
    'false',
    '--debug'
  ], {
    cwd: './test-project',
  })

  let output = ''

  spawned.stderr.pipe(process.stderr)
  spawned.stdout.on('data', function (data) {
    output += data.toString()

    console.log(data.toString())

    if (output.includes('http://localhost:3000')) {
      console.log('Server started successfully!')

      spawned.kill()
      process.exit()
    }
  })

  spawned.on('close', function (code) {
    console.log('CODE: ', code)

    process.exit(code)
  })

  spawned.on('error', function (error) {
    console.log('ERROR: ', error)

    process.exit(1)
  })

  setTimeout(() => {
    console.log('Timeout reached, killing the process...')

    process.exit(1)
  }, 30000)
}

module.exports = dev
