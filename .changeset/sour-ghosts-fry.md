---
"@latitude-data/clickhouse-connector": major
"@latitude-data/databricks-connector": major
"@latitude-data/postgresql-connector": major
"@latitude-data/snowflake-connector": major
"@latitude-data/bigquery-connector": major
"@latitude-data/athena-connector": major
"@latitude-data/duckdb-connector": major
"@latitude-data/sqlite-connector": major
"@latitude-data/mssql-connector": major
"@latitude-data/test-connector": major
"@latitude-data/mysql-connector": major
"@latitude-data/trino-connector": major
"@latitude-data/source-manager": major
"@latitude-data/cli": minor
---

Pass Source to connectors to get access to source details and also to source manager
This is a breaking change. Before connectors were receiving `rootPath` of their
queries and now this info is obta1ined from the source.

