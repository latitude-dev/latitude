# @latitude-data/storage-driver

## 0.1.0-canary.2

### Patch Changes

- 5fabfb6: Parquet files will be stored in a temporal path while materialization is still in process. Only when it finishes, it will then be moved to the actual path.

## 0.1.0-canary.1

### Patch Changes

- 4f1d88d: Dry resolve secrets helper function

## 0.1.0-canary.0

### Minor Changes

- 12994ba: Added new S3 driver

### Patch Changes

- 4f12d38: New Storage Driver package manages the temporal cache and materialized files storage.
