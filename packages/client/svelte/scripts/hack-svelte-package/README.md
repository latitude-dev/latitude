# Why all this exists?

Welcome to my hell friend. Let me tell you a little tale. Once on a time...just
kidding let's see what's all of this 😂

We have several goals with `@latitude-data/svelte`

1. We want to have a great dev experience in the monorepo by not having a build
   step inside this package and let our main app in `./apps/server` compile the
   `.svelte` and `.ts` files in this package. Way faster, feels like developing
   in the app.
2. We want to have the easiest Storybook setup. And that's by being this package
   another [SveltKit app](https://storybook.js.org/docs/get-started/install).
3. We want to use the official way in Svelte to author npm packages. And that's by
   using their packaging npm module called [svelte-package](https://kit.svelte.dev/docs/packaging). I know socking name.
4. We want our package published in [npmjs.com](https://www.npmjs.com/)

So as you can points (1) and (2) are about our dev experience as monorepo
developers. And points (3) and (4) are about shipping this package as an npmjs
UI library other people can use.

## The problem?

Right, the problem. Here starts the funny part. Before 2023 `svelte-package` was
modifing your `package.json` and Svelte maintainers felt that that was not a
good idea (and I agree). [Rich Harris can explain better than I do](https://github.com/sveltejs/kit/pull/8922). But long story short we want 2 different things while we're developing this package inside the monorepo and when we build it for others to use.

The difference resides in the `package.json` `exports` field. For comparison
here is what we want in dev and production build:

## Development

```json
// package.json
"exports": {
  ".": {
    "types": "./src/lib/index.ts",
    "import": "./src/lib/index.ts"
  }
}
```

## Production

```json
// package.json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  }
}
```

As you can see in dev we point directly to the `.src/lib` source code because we
know our Storybook or our other SveltKit app (the main app) in `./apps/server` are doing
the work of transpiling all the `*.{ts,svelte}` files. Nice!

On the other hand on production we want to point `exports` field in
`package.json` to `./dist` folder that was produced by `svelte-package`.

## The solution

Weeell, as always with code is all about trade-offs. We would't had this problem
if this package was not a `SvelteKit` app and we didn't use `svelte-package`. We
could do our own rollup plugin and ship it this way. But I think that by staying with the official
way we're more aligned with svelte ecosystem.

Sooo, what's the solution?

The solution is to put in git the development version of exports pointing to `./src/lib` so this way dev experience is fantastic. And when we do the building we modify on runtime the `package.json` with a `prebuid` script that you can see in this same folder. This script is used in the `scripts` field in the `package.json` like this:

```json
// package.json
"scripts": {
  "build:vite": "vite build",
  "prebuild": "node ./scripts/hack-svelte-package/prebuild.js",
  "buildAndPackage": "pnpm run build:vite && pnpm run package",
  "build": "pnpm run prebuild && pnpm run buildAndPackage",
}
```

All is perfect for one little thing. After we run `pnpm build` our `package.json` gets modified

```diff
    "./*": {
-      "types": "./src/lib/ui/*/index.ts",
-      "import": "./src/lib/ui/*/index.ts",
-      "svelte": "./src/lib/ui/*/index.svelte"
+      "types": "./dist/ui/*/index.d.ts",
+      "svelte": "./dist/ui/*/index.js"
     }
```

And this is bad, very bad. So the solution for this is to check if `exports`
field contains `./dist` in it. It never should. We acomplish that with a custom
eslint rule you can find in `./eslint-local-rules.cjs`

I hope you enjojed as much as I did this litle fary tale. (he didn't really enjoyed at all).
