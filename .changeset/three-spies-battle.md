---
"@latitude-data/mysql-connector": minor
---

Fix: The connector was not correctly formatting results beforing instantiating the QueryResult resulting in most queries failing to complete.
Feature: Adds more SSL options. Notably the option to just pass a truthy boolean and also the option to pass cert and key params, similar to the Postgres connector.
