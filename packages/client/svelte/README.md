# @latitude-sdk/svelte

Collection of Svelte components used in Latitude apps.

## Develop for apps/server

We have a SvelteKit app that we use for showing data apps and building queries.
This app use `@latitude-sdk/svelte` ui components. To run both packages run
`pnpm dev` in the root of the monorepo.

## Develop individual components (Storybook)

For adding or editing isolated components the recomended way is by running
Storybook. It gives to a way of visualizing your component in isolation and also
check how the component looks in dark mode or with different themes.

```bash
pnpm storybook
```

## Shadcn (components)

For some fundamental UI pieces we use [shadcn-svelte])(https://www.shadcn-svelte.com/) it's a port of the original React version. It has some interesting concepts like a CLI to create components that you fully control and also we use their theming system.

[components.json](https://www.shadcn-svelte.com/docs/components-json) - This file is part of [shadcn CLI](https://www.shadcn-svelte.com/docs/cli). It has some default settings.

Adding a new element is like this `[component] for ex.: button`:

```bash
npx shadcn-svelte@latest add [component]
```

## Publishing the package in pnpm

This is a [SvelteKit project in library mode](https://kit.svelte.dev/docs/packaging). This way the components inside `src/components/ui` can be used by other Svelte(kit) projects.
TODO: Document how to publish this component library in npm.

```bash
pnpm  build
pnpm package
```

## CSS in Latitude theming

When using Latitude client components you have two npm packages:

1. `@latitude-sdk/client` - Generic package that manage. Data calling, caching
   and also CSS theming
2. `@latitude-skd/[framework]` - This is where the UI components for your
   framework are places. For example we have `@latitude-skd/svelte` for Svelte.

The UI components come unstyled. You have to options to include our styles.

## Pre-generated CSS files (first option)

The first is by importing in your own css files or in the `<head />` of your
webapp our styles like this:

```css
@import '@latitude-sdk/client/css/all.css';
```

This add all the styles of all our components to your app. This might be
overkill if you are just using a couple of our components. For that we also
expose individual css components.

Ex.:

```css
@import '@latitude-sdk/client/css/button.css';
@import '@latitude-sdk/client/css/chart.css';
@import '@latitude-sdk/client/css/column.css';
@import '@latitude-sdk/client/css/table.css';
/* You can see all in: node_modules/@latitude-sdk/client/css/*.css */
```

## Use our TailwinCSS preset (second option)

If you're already using TailwindCSS or you need to configure more the look &
feel of things like spacing, typography, animations a good way is by using our
Tailwind config as a preset for yours:

```javascript
import preset from '@latitude-sdk/client/theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@latitude-sdk/client/src/theme/components/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

You have to (1) use the preset. (2) Point in `content` to our latitude theme files.

After that you need to import our tailwind css file in yours like this:

This will import all tailwind layers/base/components

```css
@import '@latitude-sdk/svelte/latitude.css';
```

If you don't have already Tailwind running you can see how is done for your
[framework of choice here](https://tailwindcss.com/docs/installation/framework-guides)
