# `@latitude-data/cli`

CLI for running latitude projects.

## Developing

`./sites` folder is for the developers of the Latitude project to have their own
data apps. This way they can use Latitude's CLI in development.

## How to develop in the monorep?

1. You're responsible of installing dependencies on `./apps/server`. `pnpm
install`.
2. First start CLI in dev mode `cd ./packages/cli && pnpm dev`
3. Now go to sites `cd ./sites`
4. Create a new data app site: `pnpm latitude-dev start`
5. Enter the site with the name you put: `cd ./sites/my-data-app`
6. You can start dev server: `pnpm latitude-dev dev --folder my-data-app`
