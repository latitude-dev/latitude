import fs from 'fs'
import { APP_CONFIG_PATH, MATERIALIZE_DIR, QUERIES_DIR } from '../constants'
import {
  SourceManager,
  STORAGE_TYPES,
  StorageType,
  getDriverKlass,
  StorageConfig,
} from '@latitude-data/source-manager'

const DEFAULT_STORAGE_CONFIG = {
  type: STORAGE_TYPES.disk as StorageType,
  config: { path: MATERIALIZE_DIR },
} as StorageConfig<StorageType>

function loadStorage(): StorageConfig<StorageType> {
  if (!fs.existsSync(APP_CONFIG_PATH)) {
    return DEFAULT_STORAGE_CONFIG
  }

  const file = fs.readFileSync(APP_CONFIG_PATH, 'utf8')
  try {
    const config = JSON.parse(file)
    const materialize = config?.materializeStorage ?? {}

    if (!materialize.type) return DEFAULT_STORAGE_CONFIG
    const isDisk = config?.materializeStorage?.type == STORAGE_TYPES.disk
    if (isDisk && !materialize.config) return DEFAULT_STORAGE_CONFIG

    return materialize as StorageConfig<StorageType>
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
  const storage = loadStorage()
  const driverKlass = getDriverKlass({ type: storage.type })
  return new SourceManager(QUERIES_DIR, {
    materialize: { Klass: driverKlass, config: storage.config },
  })
}

const sourceManager = buildSourceManager()
export default sourceManager
