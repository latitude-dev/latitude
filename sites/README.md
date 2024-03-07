# Development of data apps in the monorepo
`./sites` folder is for the developers of the Latitude project to have their own
data apps. This way they can use Latitude's CLI in development.

## How to?
1. First start CLI in dev mode `cd ./packages/cli && pnpm dev`
2. Now go to sites `cd ./sites`
3. Create a new data app site: `pnpm latitude-dev start`
4. Enter the site with the name you put: `cd ./sites/my-data-app`
5. You can start dev server: `pnpm latitude-dev dev --folder my-data-app`
