# @latitude-data/react

## 0.7.0

### Minor Changes

- f8ce2e6: Added support for built-in components for Latitude's React package.
- 4661d83: Implemented missing visualization charts
- 6b2a69e: Added basic components to react package
- dad171b: This release implements the following changes.

  You can now add secrets to production apps deployed to [Latitude Cloud](https://docs.latitude.so/guides/deploy/latitude_cloud#sign-up-to-latitude-cloud). To do so run:

  ```bash
  latitude secrets add SECRET_NAME=SECRET_VALUE
  ```

  These secrets become available as environment variables in the production environment of your Latitude project, which means they can replace any values users write in .env files during development.

  We've added native react component to our React library. This release implements all the [visualization components](https://docs.latitude.so/views/components/visualizations/table) available at Latitude. Combined with useQuery hook, it means users now have a complete, native way to embed their Latitude visualizations into their React apps. On top of this, we've also added complete support for themes, so users can quickly and easily change the color schema of Latitude visualizations to match their website's style.

- c39ebae: Improved internal Theme configuration, and added a way to change and create the theme in our React package.
- c26e405: Added Table, AreaChart and QueryAreaChart components

### Patch Changes

- 5e52691: Changed react peer dependency to 16.8 and upwards
- Updated dependencies [f89e566]
- Updated dependencies [f8ce2e6]
- Updated dependencies [c26e405]
- Updated dependencies [dad171b]
- Updated dependencies [c39ebae]
  - @latitude-data/client@0.10.0

## 0.7.0-next.6

### Patch Changes

- 5e52691: Changed react peer dependency to 16.8 and upwards

## 0.7.0-next.5

### Minor Changes

- 4661d83: Implemented missing visualization charts

## 0.7.0-next.4

### Minor Changes

- c26e405: Added Table, AreaChart and QueryAreaChart components

### Patch Changes

- Updated dependencies [c26e405]
  - @latitude-data/client@0.10.0-next.3

## 0.7.0-next.3

### Minor Changes

- 6b2a69e: Added basic components to react package

## 0.7.0-next.2

### Minor Changes

- c39ebae: Improved internal Theme configuration, and added a way to change and create the theme in our React package.

### Patch Changes

- Updated dependencies [c39ebae]
  - @latitude-data/client@0.10.0-next.2

## 0.7.0-next.1

### Minor Changes

- f8ce2e6: Added support for built-in components for Latitude's React package.

### Patch Changes

- Updated dependencies [f8ce2e6]
  - @latitude-data/client@0.10.0-next.1

## 0.6.3-next.0

### Patch Changes

- Updated dependencies [f89e566]
  - @latitude-data/client@0.10.0-next.0

## 0.6.2

### Patch Changes

- Updated dependencies [663b413]
  - @latitude-data/webcomponents@0.4.1
  - @latitude-data/embedding@0.1.1

## 0.6.1

### Patch Changes

- Updated dependencies [7549c67]
  - @latitude-data/webcomponents@0.4.0

## 0.6.0

### Minor Changes

- 415c307: Missing pnpm-lock.json line

## 0.5.0

### Minor Changes

- 75d8495: Fix missing defineCustomComponents export in @latitude-data/react

### Patch Changes

- Updated dependencies [75d8495]
  - @latitude-data/webcomponents@0.3.0

## 0.4.0

### Minor Changes

- edfe2d1: Fix build of stenciljs when generating react wrapper for latitude-embed

### Patch Changes

- Updated dependencies [edfe2d1]
  - @latitude-data/webcomponents@0.2.0

## 0.3.0

### Minor Changes

- 734e18d: Improve embedding experience between users apps and Latitude iframe. We did a integration as a webcomponent that users can include in their projects and listen to changes in the params inside Latitude's view. Also they can trigger view recomputations

### Patch Changes

- Updated dependencies [734e18d]
  - @latitude-data/webcomponents@0.1.0
  - @latitude-data/client@0.9.0
  - @latitude-data/embedding@0.1.0

## 0.2.0

### Minor Changes

- bbd4f8a: useQuery exports a download function to download query result as csv

### Patch Changes

- Updated dependencies [bbd4f8a]
  - @latitude-data/client@0.8.0

## 0.1.1

### Patch Changes

- Updated dependencies [7c86e2c]
- Updated dependencies [7c86e2c]
  - @latitude-data/client@0.7.0
  - @latitude-data/query_result@0.2.0

## 0.1.0

### Minor Changes

- 8519992: Introduce initial React integration. Now users can fetch latitude data from their React applications

### Patch Changes

- Updated dependencies [7d6d945]
  - @latitude-data/client@0.6.1
