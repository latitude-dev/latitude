# @latitude-data/source-manager

## 1.2.0-canary.2

### Patch Changes

- 4f1d88d: Dry resolve secrets helper function
- Updated dependencies [4f1d88d]
  - @latitude-data/storage-driver@0.1.0-canary.1

## 1.2.0-canary.1

### Minor Changes

- 889e3e7: Export type definitions of source manager in index.d.ts
- 4f12d38: Materialization is now managed in SourceManager, and temp file storage in StorageDriver

### Patch Changes

- 12994ba: Added URL to returned MaterializationInfo when materializing queries
- Updated dependencies [4f12d38]
- Updated dependencies [12994ba]
  - @latitude-data/storage-driver@0.1.0-canary.0

## 1.2.0-canary.0

### Minor Changes

- d9d0326: Materialized queries now accepts a TTL config. Running the materialize command will skip any previously materialized query that still has a valid TTL. To force a rematerialization of valid cached queries, run the materialize command with the `--force` option.

### Patch Changes

- a692a3a: Fix: Loading the same source from the config file and from a query resulted in two different source instances.

## 1.1.0

### Minor Changes

- d34d824: Added support for batching queries to all connectors

### Patch Changes

- d34d824: Fix: Loading the same source from the config file and from a query resulted in two different source instances.
- d34d824: Expose connectors package nammes
- Updated dependencies [d34d824]
  - @latitude-data/sql-compiler@1.1.0

## 1.0.1

### Patch Changes

- 6aa4599: Fix: Loading the same source from the config file and from a query resulted in two different source instances.
- 6aa4599: Expose connectors package nammes

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
