# @latitude-data/source-manager

## 1.0.0

### Major Changes

- e141dc4: Pass Source to connectors to get access to source details and also to source manager
  This is a breaking change. Before connectors were receiving `rootPath` of their
  queries and now this info is obta1ined from the source.
- e141dc4: BREAKING CHANGE: Now `ref` function inside queries requires relative paths instead of the path from the source folder

### Minor Changes

- e141dc4: New `readMetadataFromQuery` method available on any Source to read query's metadata, like its config tags, without having to compile and execute functions from the query.
- e141dc4: Add materialize command to latitude CLI
- e141dc4: Work in progress introduce materialize storage
- e141dc4: - Add the ability of running batched queries to PostgreSQL connector.
  - Allow source manager to write the result of a query into a parquet file
- e141dc4: Supported methods now must define its requirements, a resolve function to calculate the returned value, and a readMetadata function to returns its metadata. Now the compiler checks and handles these requirements.

### Patch Changes

- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
- Updated dependencies [e141dc4]
  - @latitude-data/sql-compiler@1.0.0

## 1.0.0-next.0

### Major Changes

- 5388504: Pass Source to connectors to get access to source details and also to source manager
  This is a breaking change. Before connectors were receiving `rootPath` of their
  queries and now this info is obta1ined from the source.
- a8d4658: BREAKING CHANGE: Now `ref` function inside queries requires relative paths instead of the path from the source folder

### Minor Changes

- 9e2dd26: New `readMetadataFromQuery` method available on any Source to read query's metadata, like its config tags, without having to compile and execute functions from the query.
- bd39d29: Add materialize command to latitude CLI
- aab4a4e: Work in progress introduce materialize storage
- b95b26d: - Add the ability of running batched queries to PostgreSQL connector.
  - Allow source manager to write the result of a query into a parquet file
- 26aa69d: Supported methods now must define its requirements, a resolve function to calculate the returned value, and a readMetadata function to returns its metadata. Now the compiler checks and handles these requirements.

### Patch Changes

- Updated dependencies [3e87858]
- Updated dependencies [9e2dd26]
- Updated dependencies [26aa69d]
- Updated dependencies [a8d4658]
  - @latitude-data/sql-compiler@1.0.0-next.0

## 0.1.1

### Patch Changes

- 61916ed: fixes regression that caused nested queries to not be found

## 0.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.
