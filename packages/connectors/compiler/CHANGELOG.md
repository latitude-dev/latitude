# @latitude-data/sql-compiler

## 1.0.0

### Major Changes

- e141dc4: Compiler now can read query's metadata properties without having to resolve every variable, parameter and function in it.
- e141dc4: Supported methods now must define its requirements, a resolve function to calculate the returned value, and a readMetadata function to returns its metadata. Now the compiler checks and handles these requirements.

### Minor Changes

- e141dc4: Improved handling of object properties in query logic blocks. Now you can:
  - Invoke methods from objects.
  - Modify object properties.
  - Access properties using optional chaining (the `?.` operator).

### Patch Changes

- e141dc4: BREAKING CHANGE: Now `ref` function inside queries requires relative paths instead of the path from the source folder

## 0.2.0

### Minor Changes

- 43179d6: Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

## 0.0.2

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators

## 0.0.1

### Patch Changes

- First published release of Latitude data!
