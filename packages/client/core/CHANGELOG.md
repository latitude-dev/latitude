# @latitude-data/client

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
