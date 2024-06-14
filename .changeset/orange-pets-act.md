---
"@latitude-data/source-manager": minor
"@latitude-data/cli": minor
"@latitude-data/server": minor
---

Materialized queries now accepts a TTL config. Running the materialize command will skip any previously materialized query that still has a valid TTL. To force a rematerialization of valid cached queries, run the materialize command with the `--force` option.
