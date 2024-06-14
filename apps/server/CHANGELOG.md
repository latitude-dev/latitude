# @latitude-data/server

## 2.1.0-canary.0

### Minor Changes

- d9d0326: Materialized queries now accepts a TTL config. Running the materialize command will skip any previously materialized query that still has a valid TTL. To force a rematerialization of valid cached queries, run the materialize command with the `--force` option.

### Patch Changes

- Updated dependencies [a692a3a]
- Updated dependencies [d9d0326]
  - @latitude-data/source-manager@1.2.0-canary.0
  - @latitude-data/display_table@0.0.4-canary.0

## 2.0.3

### Patch Changes

- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
  - @latitude-data/source-manager@1.1.0
  - @latitude-data/display_table@0.0.3

## 2.0.2

### Patch Changes

- Updated dependencies [6aa4599]
- Updated dependencies [6aa4599]
  - @latitude-data/source-manager@1.0.1
  - @latitude-data/display_table@0.0.2

## 2.0.1

### Patch Changes

- 6aceea4: New interface for `latitude run` command.
- Updated dependencies [6aceea4]
  - @latitude-data/display_table@0.0.1

## 2.0.0

### Major Changes

- e141dc4: BREAKING CHANGE: Now `ref` function inside queries requires relative paths instead of the path from the source folder

### Minor Changes

- e141dc4: New 'multiple' option on Select component to allow selecting multiple items
- e141dc4: - Remove query result from external
  - Remove undefined from params send to api from clients
  - Set placeholder on multi select when non is selected
- e141dc4: Add materialize command to latitude CLI
- e141dc4: latitude.json now accepts "theme" and "themeMode" attributes to customize the look and feel of the project views

### Patch Changes

- e141dc4: Fixed automatic Dark Mode detection on Svelte package and Latitude Apps
- e141dc4: Obtaining a query's ttl now does not require to compile and execute internal `runQuery` functions in it.
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
  - @latitude-data/svelte@0.8.0
  - @latitude-data/client@0.11.0
  - @latitude-data/source-manager@1.0.0
  - @latitude-data/custom_types@0.3.0

## 1.2.3

### Patch Changes

- 25728b4: Now queries ran through runQuery have access to the request's global parameters

## 1.2.2

### Patch Changes

- 4ff0c19: fix some select component styles that affected total width in some situations
- Updated dependencies [4ff0c19]
  - @latitude-data/client@0.10.2
  - @latitude-data/svelte@0.7.2

## 1.2.1

### Patch Changes

- a6306fc: Fix: undefined parameters were getting passed to query compute requests
- Updated dependencies [cf26e21]
  - @latitude-data/client@0.10.1
  - @latitude-data/svelte@0.7.1

## 1.2.0

### Minor Changes

- 25c614f: '@latitude-data/svelte' package can now be used in svelte projects without needing to configure tailwind.

### Patch Changes

- 25c614f: Improved internal Theme configuration, and added a way to change and create the theme in our React package.
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
  - @latitude-data/svelte@0.7.0
  - @latitude-data/client@0.10.0

## 1.1.6

### Patch Changes

- Updated dependencies [8fe3742]
  - @latitude-data/svelte@0.6.3
  - @latitude-data/client@0.9.1

## 1.1.5

### Patch Changes

- Updated dependencies [0d4d735]
  - @latitude-data/svelte@0.6.2

## 1.1.4

### Patch Changes

- 18e7195: Adds error logs when a request fails to process
  - @latitude-data/source-manager@0.1.1

## 1.1.3

### Patch Changes

- aee9e68: hotfix: client-side cache was not being invalidated after data changed. This
  commit removes this cache for the time being, this results in a performance hit
  but it's mostly unnoticeable given backend cache is still in place.

## 1.1.2

### Patch Changes

- 92a2848: fixes cli run command

## 1.1.1

### Patch Changes

- 61916ed: fixes regression that caused nested queries to not be found
- Updated dependencies [61916ed]
  - @latitude-data/source-manager@0.1.1

## 1.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.

### Patch Changes

- Updated dependencies [43179d6]
  - @latitude-data/source-manager@0.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [f04793e]
  - @latitude-data/connector-factory@1.0.1

## 1.0.0

### Major Changes

- e97b521: BREAKING CHANGE

  This commit changes the way connectors are installed in Latitude projects.

  Before this release, all connectors were getting bundled by default in
  production builds, greatly increasing their size and impacting install times.
  From now on, connectors are opt-in. The CLI will automatically detect all
  sources configured in .yml files and install only the necessary dependencies.

  This change also affects development watchers, which will install connectors as
  the developer adds them. However, it is the responsability of the developers
  to uninstall any unused connectors, if a particular source is removed.

### Patch Changes

- Updated dependencies [e97b521]
  - @latitude-data/connector-factory@1.0.0

## 0.11.0

### Minor Changes

- 58bca92: Remove empty params from URL when data app loads
- b735b23: Support for static files in views. Just add any file inside the `views` folder, and they will be accessible in your web app.
- 97a7d1d: Third-party scripts are now allowed inside the `<svelte:head>` tag
- 2b31b14: Feature: CLI run command now allows using a --debug tag to see the compiled query

### Patch Changes

- Updated dependencies [663b413]
  - @latitude-data/embedding@0.1.1

## 0.10.0

### Minor Changes

- c5609ac: New 'param' function to display the value of parameters in a View.

### Patch Changes

- b3593cd: Move @latitude-data/embedding to dependencies. Is used in client code

## 0.9.0

### Minor Changes

- 734e18d: Improve embedding experience between users apps and Latitude iframe. We did a integration as a webcomponent that users can include in their projects and listen to changes in the params inside Latitude's view. Also they can trigger view recomputations

### Patch Changes

- f5c6d85: Close server gracefully on SIGINT and SIGTERM
- 7e8ffe8: Refetch queries automatically when file is updated
- 512020a: Fix: CLI run command no longer cuts off last 2 results from table
- Updated dependencies [734e18d]
  - @latitude-data/client@0.9.0
  - @latitude-data/svelte@0.6.1

## 0.8.0

### Minor Changes

- bbd4f8a: Implements csv export to UI components

### Patch Changes

- 3094cb7: Manage client connection instance to allow running multiple queries in the same request.
- Updated dependencies [bbd4f8a]
- Updated dependencies [d66eecd]
  - @latitude-data/svelte@0.6.0
  - @latitude-data/client@0.8.0
  - @latitude-data/connector-factory@0.2.0

## 0.7.1

### Patch Changes

- b789703: Fixes left alignment of popover in select component
- Updated dependencies [b789703]
  - @latitude-data/svelte@0.5.3

## 0.7.0

### Minor Changes

- 7c86e2c: Allow users to download query results in csv format

### Patch Changes

- Updated dependencies [7c86e2c]
  - @latitude-data/client@0.7.0
  - @latitude-data/svelte@0.5.2
  - @latitude-data/connector-factory@0.1.6

## 0.6.1

### Patch Changes

- Updated dependencies [7d6d945]
  - @latitude-data/client@0.6.1
  - @latitude-data/svelte@0.5.1

## 0.6.0

### Minor Changes

- 718e488: Changed naming for alert types and fixed some styles
- f6baac6: New Select component

### Patch Changes

- 3a22321: Adding a reactiveToParams time will no longer wait to debounce if the data is already cached.
- Updated dependencies [718e488]
- Updated dependencies [f6baac6]
  - @latitude-data/svelte@0.5.0
  - @latitude-data/client@0.6.0

## 0.5.2

### Patch Changes

- eb539ab: Fix latitude run command not working

## 0.5.1

### Patch Changes

- 02fcca9: Fix: CLI run command was ignoring --watch flag.

## 0.5.0

### Minor Changes

- 6afc286: reactiveToParams option now allows defining a debounce time between param updates

## 0.4.1

### Patch Changes

- af148b0: Fixes query resolution algorithm for queries and sources stored in nested folders
  - @latitude-data/connector-factory@0.1.5

## 0.4.0

### Minor Changes

- 3254d59: - Signed params. Allow users to sign params so they can be send encrypted to latitude server. This is helpful for embedding latitude in a client side application in a iframe
  - Fix bug related with `__force` param not being interpreted correctly because
    it was sent as `$text:true` instead of `true` so query was not recomputed

### Patch Changes

- 7408708: Fix: remove a broken import
- 374d25a: Detached query service into its own package
- Updated dependencies [374d25a]
- Updated dependencies [3254d59]
  - @latitude-data/query_service@0.0.2
  - @latitude-data/client@0.5.0
  - @latitude-data/jwt@0.2.0
  - @latitude-data/svelte@0.4.1

## 0.3.3

### Patch Changes

- @latitude-data/connector-factory@0.1.4

## 0.3.2

### Patch Changes

- f43a3cc: Fix RunButton didn't refetch all queries when no queries were specified, and the force tag was not included in forced requests.
- Updated dependencies [f43a3cc]
- Updated dependencies [85d57e2]
- Updated dependencies [cdd2504]
  - @latitude-data/client@0.4.0
  - @latitude-data/connector-factory@0.1.3
  - @latitude-data/svelte@0.4.0

## 0.3.1

### Patch Changes

- @latitude-data/connector-factory@0.1.2

## 0.3.0

### Minor Changes

- 80f6456: - Add sort prop to charts
  - Add title and description to charts
  - Fix truncated label in charts
  - Animate chart data changes
  - Improve chart error display (will be changed in a future PR)
  - Display generic error on charts when a query fails in production

### Patch Changes

- Updated dependencies [80f6456]
  - @latitude-data/svelte@0.3.0
  - @latitude-data/client@0.3.0

## 0.2.0

### Minor Changes

- 4546334: Reworked DatePicker and added new RangeDatePicker
- a3aab3b: Added label and description to Input component
- 84cef1e: Implements the Alert component

### Patch Changes

- Updated dependencies [4546334]
- Updated dependencies [a3aab3b]
- Updated dependencies [84cef1e]
  - @latitude-data/svelte@0.2.0
  - @latitude-data/custom_types@0.2.0
  - @latitude-data/client@0.2.0
  - @latitude-data/connector-factory@0.1.1

## 0.1.2

### Patch Changes

- c86e7b9: fix: .env syncing throwing an error when .env does not exist
  fix: properly exit when user tells us to and directory is not empty
  minor: changed latitude.json default attribute names for more sensible ones

## 0.1.1

### Patch Changes

- Fix flickering when updating view data

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.1.0
  - @latitude-data/svelte@0.1.0
  - @latitude-data/connector-factory@0.1.0
  - @latitude-data/custom_types@0.1.0

## 0.0.21

### Patch Changes

- Updated dependencies [fab5ed5]
  - @latitude-data/svelte@0.0.10

## 0.0.20

### Patch Changes

- Latitude run: Align text to left on tables

## 0.0.19

### Patch Changes

- 66b9bec: New `latitude run` CLI command

## 0.0.18

### Patch Changes

- fix reference to autoimport package

## 0.0.17

### Patch Changes

- Use our own sveltekit autoimport package with no dependency conflicts

## 0.0.16

### Patch Changes

- We forgot to build the packages before release :facepalm:
- Updated dependencies
  - @latitude-data/client@0.0.9
  - @latitude-data/svelte@0.0.9
  - @latitude-data/custom_types@0.0.2
  - @latitude-data/connector-factory@0.0.3

## 0.0.15

### Patch Changes

- ef78e3e: Add build command to build the production version of Latitude
- 2a71cec: Added Link, Calendar, Popover, Select and DatePicker components
- Updated dependencies [2a71cec]
  - @latitude-data/svelte@0.0.8
  - @latitude-data/custom_types@0.0.1
  - @latitude-data/client@0.0.8
  - @latitude-data/connector-factory@0.0.3

## 0.0.14

### Patch Changes

- - fix: gitignore was including the api routes of the template project

## 0.0.13

### Patch Changes

- build all packages before release
- Updated dependencies
  - @latitude-data/client@0.0.7
  - @latitude-data/svelte@0.0.7

## 0.0.12

### Patch Changes

- - Table accepts now a class prop and has better default styles #f77a9ab
  - Table accepts inline params as a prop #b0ec854
  - Fix reactiveToParams was not working #3b0b8c9
- Updated dependencies
  - @latitude-data/client@0.0.6
  - @latitude-data/svelte@0.0.6

## 0.0.11

### Patch Changes

- Updated dependencies
  - @latitude-data/type_parser@0.0.1
  - @latitude-data/client@0.0.5
  - @latitude-data/svelte@0.0.5

## 0.0.10

### Patch Changes

- @latitude-data/connector-factory@0.0.3

## 0.0.9

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators
- Updated dependencies
  - @latitude-data/client@0.0.4
  - @latitude-data/svelte@0.0.4
  - @latitude-data/connector-factory@0.0.2

## 0.0.8

### Patch Changes

- Fix better table autoimport

## 0.0.7

### Patch Changes

- Move Table to autoimports folder

## 0.0.6

### Patch Changes

- Fix autoimports by adding missing components

## 0.0.5

### Patch Changes

- Remove static route in apps server

## 0.0.4

### Patch Changes

- Fix autoimport from svelte ui package

## 0.0.3

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.0.3
  - @latitude-data/svelte@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.0.2
  - @latitude-data/svelte@0.0.2

## 0.0.1

### Patch Changes

- First published release of Latitude data!
- Updated dependencies
  - @latitude-data/client@0.0.1
  - @latitude-data/svelte@0.0.1
  - @latitude-data/connector-factory@0.0.1
