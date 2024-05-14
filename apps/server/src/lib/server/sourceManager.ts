import fs from 'fs'
import { APP_CONFIG_PATH, MATERIALIZE_DIR, QUERIES_DIR } from '$lib/constants'
import {
  SourceManager,
  StorageConfig,
  STORAGE_TYPES,
  buildStorageDriver,
  type StorageType,
} from '@latitude-data/source-manager'

const DEFAULT_STORAGE_CONFIG = {
  type: STORAGE_TYPES.disk as StorageType,
  config: { path: MATERIALIZE_DIR },
}

function loadStorageConfig(): StorageConfig<StorageType> {
  if (!fs.existsSync(APP_CONFIG_PATH)) {
    return DEFAULT_STORAGE_CONFIG
  }

  const file = fs.readFileSync(APP_CONFIG_PATH, 'utf8')
  try {
    const config = JSON.parse(file)
    // We set the `path` to the default materialize directory
    if (config.type == STORAGE_TYPES.disk) return DEFAULT_STORAGE_CONFIG

    return config
  } catch (e) {
    return DEFAULT_STORAGE_CONFIG
  }
}

/**
 * When initializing the SourceManager,
 * we first load the storage config from the latitude.json file.
 * We configure materialize storage driver based on the config.
 */
export function buildSourceManager() {
  const config = loadStorageConfig()
  const storageDriver = buildStorageDriver(config)
  const driver = storageDriver || buildStorageDriver(DEFAULT_STORAGE_CONFIG)
  return new SourceManager(QUERIES_DIR, { materializeStorage: driver })
}

const sourceManager = buildSourceManager()
export default sourceManager
