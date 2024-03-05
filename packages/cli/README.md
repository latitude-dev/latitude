# `@latitude-data/cli`

CLI for running latitude projects.

## Developing

For contributing to the Latitude monorepo you can use our example
data app by using the CLI. These are the steps:

1. git fork/clone the repo
2. Install dependencies `pnpm i`
3. `cd packages/cli`
4. `pnpm  link --global` (This will make `latitude` command available in your machine)
5. `cd ../../sites/test-dev `
6. Start a data project: `latitude start`. It will ask de name. (Ex.: `dev-MY_THING`)
   cd ``~/WHERE_YOU_CLONED_THE_REPP/sites/test-dev/dev-MY_THING

Important: Call the data apps you create on `test-dev` starting by `dev-`. All
the content in those folder will be gitignored.
