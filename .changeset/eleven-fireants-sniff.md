---
"@latitude-data/clickhouse-connector": minor
"@latitude-data/databricks-connector": minor
"@latitude-data/postgresql-connector": minor
"@latitude-data/snowflake-connector": minor
"@latitude-data/bigquery-connector": minor
"@latitude-data/connector-factory": minor
"@latitude-data/athena-connector": minor
"@latitude-data/duckdb-connector": minor
"@latitude-data/sqlite-connector": minor
"@latitude-data/mssql-connector": minor
"@latitude-data/mysql-connector": minor
"@latitude-data/trino-connector": minor
"@latitude-data/cli": minor
"@latitude-data/server": minor
---

Avoid loading all connectors when installing a Latitude app
- We want to improve build times by reducing the amount of dependencies
- Now when a user runs `latitude dev` the connector installed
- Now when a user runs `latitude build` the connector installed
- This affects all Latitude connectors because the class of the connector is
  default exported in the ES module
