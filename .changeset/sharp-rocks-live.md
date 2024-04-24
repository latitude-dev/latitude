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
sources configured in .yml files and prompt the user to install the necessary
dependencies. 

Users will also be responsible for removing unused connectors.

## Migrating from pre-1.0 versions
If you are migrating from a pre-1.0 version, you will need to manually install
the connectors you need. Start your project development server:

```bash
latitude dev
```

The CLI will prompt you to install the necessary connectors.
