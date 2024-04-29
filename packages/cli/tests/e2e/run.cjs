const { spawnSync } = require('child_process')
const { writeFileSync } = require('fs')

function run () {
  console.log("Creating a new query...")
  spawnSync('mkdir', ['-p', 'queries/nested/sql']), {
    cwd: './test-project',
  }

  console.log("Writing files...")
  writeFileSync('queries/nested/source.yml', 'type: duckdb'), {
    cwd: './test-project',
  }
  writeFileSync('queries/nested/titles.csv', 'title\nHello, World!'), {
    cwd: './test-project',
  }
  writeFileSync('queries/nested/sql/test.sql', "SELECT * FROM read_csv_auto('queries/nested/titles.csv') LIMIT 1"), {
    cwd: './test-project',
  }

  console.log("Installing dependencies...")
  spawnSync('npm', ['install', '--save', '@latitude-data/ddckdb-connector'], { stdio: 'inherit', cwd: './test-project'})

  console.log("Running the query...")
  spawnSync('latitude', ['run', 'queries/nested/sql/test.sql'], { stdio: 'inherit', cwd: './test-project'})
}

module.exports = run
