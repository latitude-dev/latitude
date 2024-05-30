# @latitude-data/svelte

## 0.8.0-next.2

### Minor Changes

- 0f4a48a: Fix combobox label not being reactive

## 0.8.0-next.1

### Minor Changes

- 9c02462: - Remove query result from external
  - Remove undefined from params send to api from clients
  - Set placeholder on multi select when non is selected

### Patch Changes

- Updated dependencies [9c02462]
  - @latitude-data/client@0.11.0-next.1

## 0.8.0-next.0

### Minor Changes

- 62689a9: New 'multiple' option on Select component to allow selecting multiple items
- f8406cf: Svelte package now allows for custom themes and color modes into the ThemeProvider
- ed27520: Fixed automatic Dark Mode detection on Svelte package and Latitude Apps

### Patch Changes

- Updated dependencies [f8406cf]
- Updated dependencies [afc45be]
- Updated dependencies [62689a9]
- Updated dependencies [ed27520]
  - @latitude-data/client@0.11.0-next.0
  - @latitude-data/custom_types@0.3.0-next.0

## 0.7.0

### Minor Changes

- 25c614f: '@latitude-data/svelte' package can now be used in svelte projects without needing to configure tailwind.
- 25c614f: Added support for built-in components for Latitude's React package.
- 25c614f: Improved internal Theme configuration, and added a way to change and create the theme in our React package.

### Patch Changes

- 25c614f: Fixed broken style for DatePicker and RangeDatePicker components
- 25c614f: Abstracted a missing class from a Svelte component to the Client core package.
- 25c614f: Fixed blank slate for tables was rendering incorrectly
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
- Updated dependencies [25c614f]
  - @latitude-data/client@0.10.0

## 0.6.3

### Patch Changes

- 8fe3742: Fix combobox button text overflowding parent's width when space is reduced
- Updated dependencies [8fe3742]
  - @latitude-data/client@0.9.1

## 0.6.2

### Patch Changes

- 0d4d735: Fix: When displaying data in a chart, updating the query result updated the chart, but it still displayed some values from the old result.

## 0.6.1

### Patch Changes

- Updated dependencies [734e18d]
  - @latitude-data/client@0.9.0

## 0.6.0

### Minor Changes

- bbd4f8a: Implements csv export to UI components

### Patch Changes

- Updated dependencies [bbd4f8a]
  - @latitude-data/client@0.8.0

## 0.5.3

### Patch Changes

- b789703: Fixes left alignment of popover in select component

## 0.5.2

### Patch Changes

- Updated dependencies [7c86e2c]
- Updated dependencies [7c86e2c]
  - @latitude-data/client@0.7.0
  - @latitude-data/query_result@0.2.0

## 0.5.1

### Patch Changes

- Updated dependencies [7d6d945]
  - @latitude-data/client@0.6.1

## 0.5.0

### Minor Changes

- 718e488: Changed naming for alert types and fixed some styles
- f6baac6: New Select component

### Patch Changes

- Updated dependencies [718e488]
- Updated dependencies [f6baac6]
  - @latitude-data/client@0.6.0

## 0.4.1

### Patch Changes

- Updated dependencies [3254d59]
  - @latitude-data/client@0.5.0

## 0.4.0

### Minor Changes

- cdd2504: Style alert component according to latitude's design system

### Patch Changes

- Updated dependencies [f43a3cc]
- Updated dependencies [cdd2504]
  - @latitude-data/client@0.4.0

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
  - @latitude-data/custom_types@0.2.0
  - @latitude-data/client@0.2.0

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.1.0
  - @latitude-data/custom_types@0.1.0
  - @latitude-data/query_result@0.1.0

## 0.0.10

### Patch Changes

- fab5ed5: Fix table not reacting to data change

## 0.0.9

### Patch Changes

- We forgot to build the packages before release :facepalm:
- Updated dependencies
  - @latitude-data/client@0.0.9
  - @latitude-data/custom_types@0.0.2
  - @latitude-data/query_result@0.0.2

## 0.0.8

### Patch Changes

- 2a71cec: Added Link, Calendar, Popover, Select and DatePicker components
- Updated dependencies [2a71cec]
  - @latitude-data/custom_types@0.0.1
  - @latitude-data/client@0.0.8
  - @latitude-data/query_result@0.0.2

## 0.0.7

### Patch Changes

- build all packages before release
- Updated dependencies
  - @latitude-data/client@0.0.7

## 0.0.6

### Patch Changes

- - Table accepts now a class prop and has better default styles #f77a9ab
  - Table accepts inline params as a prop #b0ec854
  - Fix reactiveToParams was not working #3b0b8c9
- Updated dependencies
  - @latitude-data/client@0.0.6

## 0.0.5

### Patch Changes

- @latitude-data/client@0.0.5

## 0.0.4

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators
- Updated dependencies
  - @latitude-data/client@0.0.4
  - @latitude-data/query_result@0.0.2

## 0.0.3

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies
  - @latitude-data/client@0.0.2

## 0.0.1

### Patch Changes

- First published release of Latitude data!
- Updated dependencies
  - @latitude-data/client@0.0.1
  - @latitude-data/query_result@0.0.1
