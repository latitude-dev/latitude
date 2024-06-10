# @latitude-data/clickhouse-connector

## 2.0.3

### Patch Changes

- Updated dependencies [b2367e9]
- Updated dependencies [2086825]
- Updated dependencies [5915d92]
  - @latitude-data/source-manager@1.2.0

## 2.0.2

### Patch Changes

- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
- Updated dependencies [d34d824]
  - @latitude-data/source-manager@1.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [6aa4599]
- Updated dependencies [6aa4599]
  - @latitude-data/source-manager@1.0.1

## 2.0.0

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

## 1.1.2

### Patch Changes

- Updated dependencies [155f9e0]
  - @latitude-data/base-connector@1.1.2

## 1.1.1

### Patch Changes

- Updated dependencies [18e7195]
  - @latitude-data/base-connector@1.1.1

## 1.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.

### Patch Changes

- Updated dependencies [43179d6]
  - @latitude-data/base-connector@1.1.0

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

## 0.1.0

### Minor Changes

- d66eecd: ClickHouse connector now uses official API instead of the postgres interface.

### Patch Changes

- 3094cb7: Manage client connection instance to allow running multiple queries in the same request.
- Updated dependencies [3094cb7]
  - @latitude-data/base-connector@1.0.3
