---
"@latitude-data/source-manager": patch
"@latitude-data/storage-driver": patch
---

Parquet files will be stored in a temporal path while materialization is still in process. Only when it finishes, it will then be moved to the actual path.
