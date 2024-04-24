# @latitude-data/mssql-connector

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

## 1.0.3

### Patch Changes

- 3094cb7: Manage client connection instance to allow running multiple queries in the same request.
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
