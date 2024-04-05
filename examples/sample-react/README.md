# React Example
This example demonstrates the integration of an existing Latitude data server with a React application. It features a straightforward Vite/React application that illustrates the use of `@latitude-data/react` to retrieve data from a Latitude server.

## Run this example
You have two ways of running this example.
1. Inside monorepo
2. Copy `examples/sample-react` folder only


### Inside monorepo
. Follow this instructions:
```
git clone git@github.com:latitude-dev/latitude.git
cd latitude
pnpm install
cd examples/sample-react
VITE_LATITUDE_HOST=http://localhost:3000 pnpm dev
```
At this point if you have a running Netflix latitude project in `localhost:3000`
you should see everything ok.

### Copy `examples/sample-react`
This is another way of running this React example. After copy the folder you need to change in the `examples/sample-react/package.json`

```diff
- "@latitude-data/react": "workspace:*",
+ "@latitude-data/react": "0.2.0", // Or the version you want
```

After this change:
```bash
npm install (or yarn or pnpm)
VITE_LATITUDE_HOST=http://localhost:3000 npm run dev
```

## Running development server
```
cd examples/example-react
VITE_LATITUDE_HOST=http://localhost:3000 pnpm dev
```

This should open a browser window with the example application running.

You can point to a different Latitude server by changing the `VITE_LATITUDE_HOST` environment variable.
