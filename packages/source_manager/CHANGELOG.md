# @latitude-data/source-manager

## 0.1.1

### Patch Changes

- 61916ed: fixes regression that caused nested queries to not be found

## 0.1.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.
