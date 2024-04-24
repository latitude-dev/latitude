# @latitude-data/connector-factory

## 1.0.1

### Patch Changes

- f04793e: Fix: connectors were still being installed in latitude apps by default

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

### Patch Changes

- Updated dependencies [e97b521]
  - @latitude-data/clickhouse-connector@1.0.0
  - @latitude-data/databricks-connector@2.0.0
  - @latitude-data/postgresql-connector@2.0.0
  - @latitude-data/snowflake-connector@2.0.0
  - @latitude-data/bigquery-connector@2.0.0
  - @latitude-data/athena-connector@2.0.0
  - @latitude-data/duckdb-connector@2.0.0
  - @latitude-data/sqlite-connector@2.0.0
  - @latitude-data/mssql-connector@2.0.0
  - @latitude-data/mysql-connector@2.0.0
  - @latitude-data/trino-connector@2.0.0

## 0.2.0

### Minor Changes

- d66eecd: ClickHouse connector now uses official API instead of the postgres interface.

### Patch Changes

- Updated dependencies [3094cb7]
- Updated dependencies [d66eecd]
  - @latitude-data/clickhouse-connector@0.1.0
  - @latitude-data/databricks-connector@1.0.3
  - @latitude-data/postgresql-connector@1.1.2
  - @latitude-data/athena-connector@1.1.2
  - @latitude-data/duckdb-connector@1.0.3
  - @latitude-data/mssql-connector@1.0.3
  - @latitude-data/mysql-connector@1.1.3
  - @latitude-data/base-connector@1.0.3
  - @latitude-data/bigquery-connector@1.1.2
  - @latitude-data/snowflake-connector@1.0.4
  - @latitude-data/sqlite-connector@1.0.3
  - @latitude-data/trino-connector@1.0.3

## 0.1.6

### Patch Changes

- @latitude-data/athena-connector@1.1.1
- @latitude-data/base-connector@1.0.2
- @latitude-data/bigquery-connector@1.1.1
- @latitude-data/databricks-connector@1.0.2
- @latitude-data/duckdb-connector@1.0.2
- @latitude-data/mssql-connector@1.0.2
- @latitude-data/mysql-connector@1.1.2
- @latitude-data/postgresql-connector@1.1.1
- @latitude-data/snowflake-connector@1.0.3
- @latitude-data/sqlite-connector@1.0.2
- @latitude-data/trino-connector@1.0.2

## 0.1.5

### Patch Changes

- Updated dependencies [c081f96]
  - @latitude-data/mysql-connector@1.1.1

## 0.1.4

### Patch Changes

- Updated dependencies [955fcf2]
- Updated dependencies [5728564]
- Updated dependencies [4b49feb]
  - @latitude-data/bigquery-connector@1.1.0
  - @latitude-data/snowflake-connector@1.0.2
  - @latitude-data/athena-connector@1.1.0

## 0.1.3

### Patch Changes

- 85d57e2: CLI (minor): Allow users to install custom npm dependencies to their Latitude projects with regular npm install
  Connectors factory (patch): Raise an error if user tries to use a secret environment variable that we cannot find in the environment.

## 0.1.2

### Patch Changes

- Updated dependencies [2c933ba]
  - @latitude-data/mysql-connector@1.1.0

## 0.1.1

### Patch Changes

- Updated dependencies [b9282fe]
- Updated dependencies [ae29ce6]
- Updated dependencies [d4bac9b]
  - @latitude-data/postgresql-connector@1.1.0
  - @latitude-data/databricks-connector@1.0.1
  - @latitude-data/snowflake-connector@1.0.1
  - @latitude-data/bigquery-connector@1.0.1
  - @latitude-data/athena-connector@1.0.1
  - @latitude-data/duckdb-connector@1.0.1
  - @latitude-data/sqlite-connector@1.0.1
  - @latitude-data/mssql-connector@1.0.1
  - @latitude-data/mysql-connector@1.0.1
  - @latitude-data/trino-connector@1.0.1
  - @latitude-data/base-connector@1.0.1

## 0.1.0

### Minor Changes

- Public release 0.1.0 🎉

### Patch Changes

- Updated dependencies
  - @latitude-data/athena-connector@1.0.0
  - @latitude-data/base-connector@1.0.0
  - @latitude-data/bigquery-connector@1.0.0
  - @latitude-data/databricks-connector@1.0.0
  - @latitude-data/duckdb-connector@1.0.0
  - @latitude-data/mssql-connector@1.0.0
  - @latitude-data/mysql-connector@1.0.0
  - @latitude-data/postgresql-connector@1.0.0
  - @latitude-data/snowflake-connector@1.0.0
  - @latitude-data/sqlite-connector@1.0.0
  - @latitude-data/trino-connector@1.0.0

## 0.0.3

### Patch Changes

- Updated dependencies
  - @latitude-data/duckdb-connector@0.0.3

## 0.0.2

### Patch Changes

- - View component is columnar by default now
  - Improved Table blank slate with proper loading indicators
- Updated dependencies
  - @latitude-data/athena-connector@0.0.2
  - @latitude-data/base-connector@0.0.2
  - @latitude-data/bigquery-connector@0.0.2
  - @latitude-data/databricks-connector@0.0.2
  - @latitude-data/duckdb-connector@0.0.2
  - @latitude-data/mssql-connector@0.0.2
  - @latitude-data/mysql-connector@0.0.2
  - @latitude-data/postgresql-connector@0.0.2
  - @latitude-data/snowflake-connector@0.0.2
  - @latitude-data/sqlite-connector@0.0.2
  - @latitude-data/trino-connector@0.0.2

## 0.0.1

### Patch Changes

- First published release of Latitude data!
- Updated dependencies
  - @latitude-data/athena-connector@0.0.1
  - @latitude-data/base-connector@0.0.1
  - @latitude-data/bigquery-connector@0.0.1
  - @latitude-data/databricks-connector@0.0.1
  - @latitude-data/duckdb-connector@0.0.1
  - @latitude-data/mssql-connector@0.0.1
  - @latitude-data/mysql-connector@0.0.1
  - @latitude-data/postgresql-connector@0.0.1
  - @latitude-data/snowflake-connector@0.0.1
  - @latitude-data/sqlite-connector@0.0.1
  - @latitude-data/trino-connector@0.0.1
