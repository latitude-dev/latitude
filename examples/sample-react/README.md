# React Example
This example demonstrates the integration of an existing Latitude data server with a React application. It features a straightforward Vite/React application that illustrates the use of `@latitude-data/react` to retrieve data from a Latitude server.

## Installation
If you forked this repo and want to try this example when using `pnpm` as your
package manage install dependencies independently of the workspace. This will
install all dependencies for this React example project:

```
pnpm install --ignore-workspace
```

## Running development server
```
cd examples/example-react
VITE_LATITUDE_HOST=http://localhost:3000 pnpm dev
```

This should open a browser window with the example application running.

You can point to a different Latitude server by changing the `VITE_LATITUDE_HOST` environment variable.
