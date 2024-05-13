# @latitude-data/client

## 0.10.0

### Minor Changes

- 25c614f: '@latitude-data/svelte' package can now be used in svelte projects without needing to configure tailwind.
- 25c614f: Added support for built-in components for Latitude's React package.
- 25c614f: Improved internal Theme configuration, and added a way to change and create the theme in our React package.

### Patch Changes

- 25c614f: Fixed broken style for DatePicker and RangeDatePicker components
- 25c614f: Abstracted a missing class from a Svelte component to the Client core package.

## 0.9.1

### Patch Changes

- 8fe3742: Fix combobox button text overflowding parent's width when space is reduced

## 0.9.0

### Minor Changes

- 734e18d: Improve embedding experience between users apps and Latitude iframe. We did a integration as a webcomponent that users can include in their projects and listen to changes in the params inside Latitude's view. Also they can trigger view recomputations

## 0.8.0

### Minor Changes

- bbd4f8a: Implements csv export to UI components

## 0.7.0

### Minor Changes

- 7c86e2c: Allow users to download query results in csv format

### Patch Changes

- Updated dependencies [7c86e2c]
  - @latitude-data/query_result@0.2.0

## 0.6.1

### Patch Changes

- 7d6d945: Remove max width in input components

## 0.6.0

### Minor Changes

- 718e488: Changed naming for alert types and fixed some styles
- f6baac6: New Select component

## 0.5.0

### Minor Changes

- 3254d59: - Signed params. Allow users to sign params so they can be send encrypted to latitude server. This is helpful for embedding latitude in a client side application in a iframe
  - Fix bug related with `__force` param not being interpreted correctly because
    it was sent as `$text:true` instead of `true` so query was not recomputed

## 0.4.0

### Minor Changes

- cdd2504: Style alert component according to latitude's design system

### Patch Changes

- f43a3cc: Fix RunButton didn't refetch all queries when no queries were specified, and the force tag was not included in forced requests.

## 0.3.0

### Minor Changes

- 80f6456: - Add sort prop to charts
  - Add title and description to charts
  - Fix truncated label in charts
  - Animate chart data changes
  - Improve chart error display (will be changed in a future PR)
  - Display generic error on charts when a query fails in production

## 0.2.0

### Minor Changes

- 4546334: Reworked DatePicker and added new RangeDatePicker
- a3aab3b: Added label and description to Input component
- 84cef1e: Implements the Alert component

### Patch Changes

- Updated dependencies [4546334]
  - @latitude-data/custom_types@0.2.0

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

### Patch Changes

- Updated dependencies
  - @latitude-data/custom_types@0.1.0
  - @latitude-data/query_result@0.1.0

## 0.0.9

### Patch Changes

- We forgot to build the packages before release :facepalm:
- Updated dependencies
  - @latitude-data/custom_types@0.0.2
  - @latitude-data/query_result@0.0.2

## 0.0.8

### Patch Changes

- 2a71cec: Added Link, Calendar, Popover, Select and DatePicker components
- Updated dependencies [2a71cec]
  - @latitude-data/custom_types@0.0.1
  - @latitude-data/query_result@0.0.2

## 0.0.7

### Patch Changes

- build all packages before release

## 0.0.6

### Patch Changes

- - Table accepts now a class prop and has better default styles #f77a9ab
  - Table accepts inline params as a prop #b0ec854
  - Fix reactiveToParams was not working #3b0b8c9

## 0.0.5

### Patch Changes

- Updated dependencies
  - @latitude-data/type_parser@0.0.1

## 0.0.4

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators
- Updated dependencies
  - @latitude-data/query_result@0.0.2

## 0.0.3

### Patch Changes

- Expose latitude.css in dist/latitude.css

## 0.0.2

### Patch Changes

- Release client/core with missing latitude.css file.

## 0.0.1

### Patch Changes

- First published release of Latitude data!
- Updated dependencies
  - @latitude-data/query_result@0.0.1
