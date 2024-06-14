# @latitude-data/sqlite-connector

## 1.0.3-canary.0

### Patch Changes

- Updated dependencies [a692a3a]
- Updated dependencies [d9d0326]
  - @latitude-data/source-manager@1.2.0-canary.0

## 1.0.2

### Patch Changes

- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
  - @latitude-data/source-manager@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [6aa4599]
- Updated dependencies [6aa4599]
  - @latitude-data/source-manager@1.0.1

## 1.0.0

### Major Changes

- e141dc4: Pass Source to connectors to get access to source details and also to source manager
  This is a breaking change. Before connectors were receiving `rootPath` of their
  queries and now this info is obta1ined from the source.

### Patch Changes

- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
  - @latitude-data/source-manager@1.0.0

## 0.1.2

### Patch Changes

- Updated dependencies [155f9e0]
  - @latitude-data/base-connector@1.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [18e7195]
  - @latitude-data/base-connector@1.1.1

## 0.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.

### Patch Changes

- Updated dependencies [43179d6]
  - @latitude-data/base-connector@1.1.0

## 1.0.3

### Patch Changes

- Updated dependencies [3094cb7]
  - @latitude-data/base-connector@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [7c86e2c]
  - @latitude-data/query_result@0.2.0
  - @latitude-data/base-connector@1.0.2

## 1.0.1

### Patch Changes

- ae29ce6: Moved latitude packages from peer to regular dependencies
- Updated dependencies [ae29ce6]
  - @latitude-data/base-connector@1.0.1

## 1.0.0

### Minor Changes

- Public release 0.1.0 🎉

### Patch Changes

- Updated dependencies
  - @latitude-data/base-connector@1.0.0
  - @latitude-data/query_result@0.1.0

## 0.0.2

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators
- Updated dependencies
  - @latitude-data/base-connector@0.0.2
  - @latitude-data/query_result@0.0.2

## 0.0.1

### Patch Changes

- First published release of Latitude data!
- Updated dependencies
  - @latitude-data/base-connector@0.0.1
  - @latitude-data/query_result@0.0.1
