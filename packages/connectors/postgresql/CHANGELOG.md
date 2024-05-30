# @latitude-data/postgresql-connector

## 3.0.0-next.1

### Minor Changes

- 6bd91eb: - Add --materialize flag to latitude deploy
  - Allow posgresql source read CA certificate from an .env file

## 3.0.0-next.0

### Major Changes

- 5388504: Pass Source to connectors to get access to source details and also to source manager
  This is a breaking change. Before connectors were receiving `rootPath` of their
  queries and now this info is obta1ined from the source.

### Minor Changes

- b95b26d: - Add the ability of running batched queries to PostgreSQL connector.
  - Allow source manager to write the result of a query into a parquet file

### Patch Changes

- Updated dependencies [9e2dd26]
- Updated dependencies [bd39d29]
- Updated dependencies [aab4a4e]
- Updated dependencies [b95b26d]
- Updated dependencies [26aa69d]
- Updated dependencies [5388504]
- Updated dependencies [a8d4658]
  - @latitude-data/source-manager@1.0.0-next.0

## 2.1.1

### Patch Changes

- Updated dependencies [18e7195]
  - @latitude-data/base-connector@1.1.1

## 2.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.

### Patch Changes

- Updated dependencies [43179d6]
  - @latitude-data/base-connector@1.1.0

## 2.0.0

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

## 1.1.2

### Patch Changes

- 3094cb7: Manage client connection instance to allow running multiple queries in the same request.
- Updated dependencies [3094cb7]
  - @latitude-data/base-connector@1.0.3

## 1.1.1

### Patch Changes

- Updated dependencies [7c86e2c]
  - @latitude-data/query_result@0.2.0
  - @latitude-data/base-connector@1.0.2

## 1.1.0

### Minor Changes

- b9282fe: Added ssl support to postgres connector

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
