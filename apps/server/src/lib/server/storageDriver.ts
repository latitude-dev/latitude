import fs from 'fs'
import { APP_CONFIG_PATH, STORAGE_DIR } from '../constants'
import {
  StorageDriverConfig,
  StorageType,
  getStorageDriver,
} from '@latitude-data/storage-driver'

const DEFAULT_STORAGE_CONFIG = {
  type: StorageType.disk,
  path: STORAGE_DIR,
}

function readStorageConfig(): StorageDriverConfig {
  if (!fs.existsSync(APP_CONFIG_PATH)) {
    return DEFAULT_STORAGE_CONFIG
  }

  const file = fs.readFileSync(APP_CONFIG_PATH, 'utf8')
  try {
    const latitudeJson = JSON.parse(file)
    const storageConfig = latitudeJson?.storage ?? {}
    if (!storageConfig.type) return DEFAULT_STORAGE_CONFIG
    return storageConfig
  } catch (e) {
    return DEFAULT_STORAGE_CONFIG
  }
}

const storageDriver = getStorageDriver(readStorageConfig())
export default storageDriver
