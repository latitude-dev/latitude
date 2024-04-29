const { spawn } = require('child_process')
const { writeFileSync } = require('fs')

function run () {
  return new Promise((resolve) => {
    try {
      const cwd = './test-project'
      const proc = spawn('mkdir', ['-p', 'queries/nested/sql'], {cwd})

      proc.on('error', (err) => {
        console.error(err)

        process.exit(1)
      })

      proc.on('close', () => {
        writeFileSync('test-project/queries/nested/source.yml', 'type: duckdb')
        writeFileSync('test-project/queries/nested/titles.csv', 'title\nHello, World!')
        writeFileSync('test-project/queries/nested/sql/test.sql', "SELECT * FROM read_csv_auto('queries/nested/titles.csv') LIMIT 1")

        const proc = spawn('npm', ['install', '--save', '@latitude-data/duckdb-connector'], { cwd, stdio: 'inherit'})
        proc.on('error', (err) => {
          console.error(err)

          process.exit(1)
        })
        proc.on('close', () => {
          const proc = spawn('latitude', ['run', 'nested/sql/test.sql'], { cwd, stdio: 'inherit'})
          proc.on('error', (err) => {
            console.error(err)

            process.exit(1)
          })
          proc.on('close', () => resolve())
        })

      })
    } catch (e) {
      console.error(e)

      process.exit(1)
    }
  })
}

module.exports = run
