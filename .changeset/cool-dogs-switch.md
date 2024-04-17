---
"@latitude-data/clickhouse-connector": minor
"@latitude-data/databricks-connector": minor
"@latitude-data/postgresql-connector": minor
"@latitude-data/snowflake-connector": minor
"@latitude-data/bigquery-connector": minor
"@latitude-data/sql-compiler": minor
"@latitude-data/athena-connector": minor
"@latitude-data/duckdb-connector": minor
"@latitude-data/sqlite-connector": minor
"@latitude-data/mssql-connector": minor
"@latitude-data/mysql-connector": minor
"@latitude-data/trino-connector": minor
"@latitude-data/base-connector": minor
"@latitude-data/test-connector": minor
"@latitude-data/source-manager": minor
"@latitude-data/cli": minor
"@latitude-data/server": minor
---

Now query behaviour can be configured either in the source config file or the query themselves by adding a custom keyword. The first available option is `ttl`, that defines the cached lifetime of the query results in the server, before having to be refetched again.
