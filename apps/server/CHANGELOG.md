# @latitude-data/server

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
