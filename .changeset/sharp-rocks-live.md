---
"@latitude-data/clickhouse-connector": major
"@latitude-data/databricks-connector": major
"@latitude-data/postgresql-connector": major
"@latitude-data/snowflake-connector": major
"@latitude-data/bigquery-connector": major
"@latitude-data/connector-factory": major
"@latitude-data/athena-connector": major
"@latitude-data/duckdb-connector": major
"@latitude-data/sqlite-connector": major
"@latitude-data/mssql-connector": major
"@latitude-data/mysql-connector": major
"@latitude-data/trino-connector": major
"@latitude-data/cli": major
"@latitude-data/server": major
---

BREAKING CHANGE

This commit changes the way connectors are installed in Latitude projects.

Before this release, all connectors were getting bundled by default in
production builds, greatly increasing their size and impacting install times.
From now on, connectors are opt-in. The CLI will automatically detect all
sources configured in .yml files and install only the necessary dependencies.

This change also affects development watchers, which will install connectors as
the developer adds them. However, it is the responsability of the developers
to uninstall any unused connectors, if a particular source is removed.
